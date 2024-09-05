@echo off

setlocal enabledelayedexpansion

rem Work project batch build file
rem Emscripten SDK...

cd examples

if not exist node_modules (
    @call cmd /C "npm install"
)

@call cmd /C "npm run build:webpack"
cd ..

exit /b 0