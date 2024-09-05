@echo off

setlocal enabledelayedexpansion

rem webpack batch build file

cd examples
@call cmd /C "npm run build:webpack"
cd ..

exit /b 0