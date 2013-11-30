#!/bin/bash
PASSWORD=[CENSORED]

case "$1" in
	'all-pairs' )
		mysql -u remote_gs --password=$PASSWORD -e 'SELECT CONCAT("[",r.ID,"] ",r.CLIENT_NAME) AS RemoteName, (SELECT MAX(EVENT_CREATION_DATE) FROM remote_gs.EVENT_LOG e WHERE EVENT_TYPE="load-client" AND e.CLIENT_ID = r.ID) AS LAST_LOGIN_REMOTE, CONCAT("[",g.ID,"] ",g.CLIENT_NAME) AS GroovesharkName, (SELECT MAX(EVENT_CREATION_DATE) FROM remote_gs.EVENT_LOG e WHERE EVENT_TYPE="load-client" AND e.CLIENT_ID = g.ID) AS LAST_LOGIN_GROOVESHARK, (SELECT MAX(EVENT_CREATION_DATE) FROM remote_gs.EVENT_LOG e WHERE EVENT_TYPE="pairing" AND e.CLIENT_ID = r.ID) AS PAIR_DATE FROM remote_gs.CLIENT_PAIRING p LEFT JOIN remote_gs.CLIENT r ON r.ID = p.REMOTE_ID LEFT JOIN remote_gs.CLIENT g ON g.ID = p.GROOVESHARK_ID ORDER BY LAST_LOGIN_REMOTE DESC;' 
		;;

	'all-remote-pairs' )
	mysql -u remote_gs --password=$PASSWORD -e 'SELECT CONCAT("[",r.ID,"] ",r.CLIENT_NAME) AS RemoteName, (SELECT COUNT(*) FROM remote_gs.CLIENT_PAIRING p WHERE p.REMOTE_ID = r.ID) AS PAIR_COUNT, (SELECT IFNULL(GROUP_CONCAT(pg.CLIENT_NAME SEPARATOR ", "),"") FROM remote_gs.CLIENT_PAIRING p LEFT JOIN remote_gs.CLIENT pg ON pg.ID = p.GROOVESHARK_ID WHERE p.REMOTE_ID = r.ID) AS PAIR_LIST, (SELECT MAX(EVENT_CREATION_DATE) FROM remote_gs.EVENT_LOG e WHERE EVENT_TYPE="load-client" AND e.CLIENT_ID = r.ID) AS LAST_LOGIN_REMOTE, r.CLIENT_CREATION_DATE FROM remote_gs.CLIENT r WHERE r.CLIENT_TYPE=2 ORDER BY LAST_LOGIN_REMOTE ASC;' 
	;;

	'all-gs-pairs' )
	mysql -u remote_gs --password=$PASSWORD -e 'SELECT CONCAT("[",g.ID,"] ",g.CLIENT_NAME) AS RemoteName, (SELECT COUNT(*) FROM remote_gs.CLIENT_PAIRING p WHERE p.GROOVESHARK_ID = g.ID) AS PAIR_COUNT, (SELECT MAX(EVENT_CREATION_DATE) FROM remote_gs.EVENT_LOG e WHERE EVENT_TYPE="load-client" AND e.CLIENT_ID = g.ID) AS LAST_LOGIN_GROOVESHARK, g.CLIENT_CREATION_DATE FROM remote_gs.CLIENT g WHERE g.CLIENT_TYPE=1 ORDER BY LAST_LOGIN_GROOVESHARK ASC;' 
	;;

	'all-remote-unmatched' )
	mysql -u remote_gs --password=$PASSWORD -e 'SELECT CONCAT("[",r.ID,"] ",r.CLIENT_NAME) AS RemoteName, (SELECT MAX(EVENT_CREATION_DATE) FROM remote_gs.EVENT_LOG e WHERE EVENT_TYPE="load-client" AND e.CLIENT_ID = r.ID) AS LAST_LOGIN_REMOTE, r.CLIENT_CREATION_DATE, (SELECT COUNT(*) FROM remote_gs.CLIENT_PAIRING p WHERE p.REMOTE_ID = r.ID) AS PAIR_COUNT FROM remote_gs.CLIENT r WHERE r.CLIENT_TYPE=2 AND (SELECT COUNT(*) FROM remote_gs.CLIENT_PAIRING p WHERE p.REMOTE_ID = r.ID) = 0 ORDER BY LAST_LOGIN_REMOTE ASC;' 
	;;

	'all-gs-unmatched' )
	mysql -u remote_gs --password=$PASSWORD -e 'SELECT CONCAT("[",g.ID,"] ",g.CLIENT_NAME) AS GroovesharkName, (SELECT MAX(EVENT_CREATION_DATE) FROM remote_gs.EVENT_LOG e WHERE EVENT_TYPE="load-client" AND e.CLIENT_ID = g.ID) AS LAST_LOGIN_REMOTE, g.CLIENT_CREATION_DATE, (SELECT COUNT(*) FROM remote_gs.CLIENT_PAIRING p WHERE p.GROOVESHARK_ID = g.ID) AS PAIR_COUNT FROM remote_gs.CLIENT g WHERE g.CLIENT_TYPE=1 AND (SELECT COUNT(*) FROM remote_gs.CLIENT_PAIRING p WHERE p.GROOVESHARK_ID = g.ID) = 0 ORDER BY LAST_LOGIN_REMOTE ASC;' 
	;;
	* )
	echo -e " Wrong arguments!\n" \
			"================\n" \
			"Please use: \n" \
			"\tall-pairs: \n" \
			"\tall-remote-pairs: \n" \
			"\tall-gs-pairs: \n" \
			"\tall-remote-unmatched: \n" \
			"\tall-gs-unmatched: \n";
	;;
esac
