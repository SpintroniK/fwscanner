#include <zbar.h>

#include <string>
#include <vector>
#include <algorithm>

class Scanner
{

public:

    Scanner() {};

    int scan_image(uint8_t* data, int width, int height)
    {
        result = "";
        scanner.set_config(zbar::ZBAR_NONE, zbar::ZBAR_CFG_ENABLE, 0); 
        scanner.set_config(zbar::ZBAR_EAN13, zbar::ZBAR_CFG_ENABLE, 1);

        auto image = zbar::Image(width, height, "Y800", data, width * height);

        scanner << image;  

        // extract results
        size_t nbResults = 0;
        for(auto symbol = image.symbol_begin(); symbol != image.symbol_end(); ++symbol) 
        {
            result = symbol->get_data();
            quality = symbol->get_quality();

            std::vector<zbar::Symbol::Point> points;
            for(auto pointIt = symbol->point_begin(); pointIt != symbol->point_end(); ++pointIt)
            {
                const auto& point = *pointIt;
                points.push_back(point);
            }

            const auto minMaxX = std::minmax_element(points.begin(), points.end(), [](const auto& m, const auto& n)
            {
                return m.x < n.x;
            });

            const auto minMaxY = std::minmax_element(points.begin(), points.end(), [](const auto& m, const auto& n)
            {
                return m.y < n.y;
            });

            topLeft = zbar::Symbol::Point(minMaxX.first->x, minMaxY.first->y);
            bottomRight = zbar::Symbol::Point(minMaxX.second->x, minMaxY.second->y);

            nbResults++;
        }

        // clean up
        image.set_data(nullptr, 0);
        return 0;
    }

    int ScanImage(std::uintptr_t d, int width, int height)
    {
        uint8_t* data = reinterpret_cast<uint8_t*>(d);
        return scan_image(data, width, height);
    }

    std::string get_result()
    {
        return result;
    }

    int get_quality()
    {
        return quality;
    }


    std::vector<int> get_rect()
    {
        return std::vector<int>{int(topLeft.x), int(topLeft.y), int(bottomRight.x), int(bottomRight.y)};
    }

private:

    zbar::ImageScanner scanner;
    std::string result;
    int quality = 0;
    zbar::Symbol::Point topLeft{};
    zbar::Symbol::Point bottomRight{};

};
