iptables -I INPUT -i eth0 -p tcp --dport 8080  -j ACCEPT
/sbin/service iptables save
forever start -a -l server.log -o out.log -e err.log server.js
