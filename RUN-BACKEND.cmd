@ECHO OFF

REM ECHO Iniciando el servicio de MongoDB
REM PUSHD "\Program Files\MongoDB\Server\4.4\bin"
REM START "MongoDB Service" mongod.exe
REM POPD

ECHO Iniciando API
PUSHD "\Users\lruiz\Documents\CONSULTORIAS\TRACEORGANIC API"
START "API running via Nodemon" npm run nodemon
POPD

ECHO Iniciando API en Navegador
START firefox -new-window http://localhost:5000/doc/ 

REM ECHO Iniciando Robo3T
REM START /D "C:\Program Files\Robo 3T 1.4.2" robo3t.exe

CMD /C PAUSE