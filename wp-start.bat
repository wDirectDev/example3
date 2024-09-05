@echo off

setlocal enabledelayedexpansion

rem webpack batch start file

cd examples
@call cmd /C "npm run start:webpack"
cd ..

exit /b 0