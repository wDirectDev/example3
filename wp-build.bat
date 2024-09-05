@echo off

setlocal enabledelayedexpansion

rem webpack batch build file

cd examples

if not exist node_modules (
    @call cmd /C "npm install"
)

@call cmd /C "npm run build:webpack"
cd ..

exit /b 0