
deploy:
	rsync -avzhe ssh   --progress --exclude '.git' --exclude 'cache' --exclude 'data/*'  . myserver.com:letterbox/
