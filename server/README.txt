Steps to set-up NodeJS and Socket.IO:

1. Run node-v0.10.7-x64.msi
2. Run start.cmd

The end.

Steps to set everything up on Linux:
Open up port 8080. Make sure no programs like APF is managing the rules automatically. See /etc/apf/conf.apf for more infos.
Set up Forever: npm install forever -g
Start up the server: forever start server.js