
#include <emscripten/bind.h>

#include "scan.cpp"

using namespace emscripten;

// Binding code
EMSCRIPTEN_BINDINGS(scanner) 
{
    class_<Scanner>("Scanner")
    .constructor()
    .function("get_quality", &Scanner::get_quality)
    .function("scan_image", &Scanner::ScanImage)
    .function("get_result", &Scanner::get_result)
    .function("get_quality", &Scanner::get_quality)
    .function("get_rect", &Scanner::get_rect)
    ;


    register_vector<int>("vector<int>");
}

