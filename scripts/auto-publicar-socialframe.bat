@echo off
REM ============================================================
REM  SOCIAL FRAME - publicacao automatica (Agendador de Tarefas)
REM  Roda o sync; se o catalogo mudou, commita + push + deploy.
REM  Log em: scripts\auto-publicar.log
REM ============================================================

set "PROJ=C:\Users\rodri\Downloads\SITE RONCOLATO"
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\cmd;%PATH%"
set "LOG=%PROJ%\scripts\auto-publicar.log"

cd /d "%PROJ%"

echo. >> "%LOG%"
echo ===== %DATE% %TIME% ===== >> "%LOG%"
node "scripts\publicar-social-frame.js" --auto >> "%LOG%" 2>&1

exit /b %ERRORLEVEL%
