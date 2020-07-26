#include <opencv2/core.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/videoio.hpp>
#include <opencv2/imgproc.hpp>

#include <iostream>
#include <array>
#include <algorithm>

#include "scan.cpp"

int main(int arc, char** argv)
{

    cv::VideoCapture cap(0); 

    // Check if camera opened successfully
    if(!cap.isOpened())
    {
        std::cout << "Error opening video stream" << std::endl; 
        return -1; 
    } 
    while(1)
    { 
        cv::Mat frame; 

        // Capture frame-by-frame 
        cap >> frame;

        // If the frame is empty, break immediately
        if (frame.empty())
            break;



        cv::Mat imageGrayscale;
        cv::cvtColor(frame, imageGrayscale, cv::COLOR_BGR2GRAY);

        Scanner scan;

        scan.scan_image(imageGrayscale.data, imageGrayscale.size().width, imageGrayscale.size().height);
        
        const auto rect = scan.get_rect();
        std::array<int, 4> rectArray{};
        std::copy(rect.begin(), rect.end(), rectArray.begin()); 

        const auto[topLeftX, topLeftY, bottomRightX, bottomRightY] = rectArray;

        cv::rectangle(frame, {topLeftX, topLeftY}, {bottomRightX, bottomRightY}, {0, 0, 255}, 2, cv::LINE_AA);
        

        std::cout << scan.get_result() << std::endl;

        // Display the resulting frame    
        imshow( "Frame", frame);

        // Press  ESC on keyboard to  exit
        char c = (char)cv::waitKey(1);
        if(c == 27) 
            break;

    }

    return 0;
}