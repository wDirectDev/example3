@echo off

setlocal enabledelayedexpansion

rem webpack batch start file

cd examples

if not exist node_modules (
    @call cmd /C "npm install"
)

@call cmd /C "npm run start:webpack"
cd ..

exit /b 0