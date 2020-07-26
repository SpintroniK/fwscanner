export async function listCameras()
{

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(dev => "videoinput" === dev.kind.toLowerCase())

    return new Promise(resolve =>
    {
        resolve(videoDevices);
    });
}

export async function openCamera(constraints={})
{
    if(typeof constraints.video === 'undefined')
    {
        constraints.video = true;
    }
    return await navigator.mediaDevices.getUserMedia(constraints);
}

export default class Camera
{

    constructor(indication='', cameras=false)
    {
        this.dev = null;
        this.indication = indication;
    }

    async Open(constraints)
    {
        if(navigator.mediaDevices.getUserMedia) 
        {
            
            const cameras = await listCameras();

            for(let camera of cameras)
            {
                if(camera.label.indexOf(this.indication) >= 0)
                {
                    // console.log(camera.kind + "Name: " + camera.label + " id = " + camera.deviceId);
                    this.dev = camera;
                }
            }
    
            if(!this.dev)
            {
                this.dev = cameras[cameras.length - 1];
            }


            constraints.video.deviceId = {ideal: this.dev.deviceId};
        
            const stream = await openCamera(constraints);

            this.stream = document.createElement('video');
            this.stream.id = `${stream.id}-video`;
            this.stream.loop = true;
            this.stream.setAttribute('playsinline', 'playsinline');
            this.stream.srcObject = stream;

            this.canvas = document.createElement('canvas');
            this.canvas.id = `${stream.id}-canvas`;

            document.body.prepend(this.canvas);
            document.body.prepend(this.stream);

            return {video: this.stream, canvas: this.canvas};
        }
        else throw new Error('Camera not available.')

    }

    async Start()
    {
        this.stream.play();

        return new Promise(res => 
        {
            return res(new Promise(resolve => this.stream.onplaying = resolve)
            .then(_ =>
            {
                this.canvas.width = this.stream.videoWidth;
                this.canvas.height = this.stream.videoHeight;
            }));
        },
        err =>
        {
            throw new Error('Could not start camera stream.');
        });
    }

    Stop()
    {
        this.stream.pause();
    }

}
