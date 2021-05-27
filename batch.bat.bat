@ECHO OFF
set /p folder_name=folder_name?:
set /p username=username?:
set /p number=Number?:
set /p password=password?:


ECHO %folder_name%
ECHO %username%
ECHO %number%
ECHO %password%

MD %folder_name%

SET /A "index = 0"
SET /A "count = %number%"


:while
if %index% lss %count% (

   MD "C:\Users\User\Documents\verint\%folder_name%\%folder_name%%index%"
   NET USER "%folder_name%%index%"  %password% /ADD
   SET /A "index = index + 1"
   goto :while
)

netsh advfirewall set  currentprofile state off
netsh interface ipv4 show config >"C:\Users\User\Documents\verint\%folder_name%\text.txt"



PAUSE