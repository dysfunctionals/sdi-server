FROM alpine
COPY . /app
RUN apk update &&\
	apk add npm &&\
	apk add bash &&\
	apk add redis &&\
	cd app &&\
	npm install
CMD bash
