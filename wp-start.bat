@echo off

setlocal enabledelayedexpansion

rem Work project batch start file
rem Emscripten SDK...

cd examples

if not exist node_modules (
    @call cmd /C "npm install"
)

@call cmd /C "npm run start:webpack"

cd ..

exit /b 0