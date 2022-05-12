# 어떤 환경에서 도커 이미지를 만들지 결정하기.
FROM node:16-alpine3.14
WORKDIR /usr

# 패키지 설치
COPY ["package.json", "package-lock.json", "./"]
RUN ["npm", "install"]

# 나머지 모두 복사
COPY ["app/", "./app/"]

# 도커 컨테이너에 접근할 수 있게 포트 열어주기
#ENTRYPOINT ["node", "./app"]
EXPOSE 3000

# 앱 실행시키기
CMD [ "npm", "start" ]