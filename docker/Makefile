TAG := $$(git log -1 --pretty=format:%h)
ECR_URI := 497217256558.dkr.ecr.ap-northeast-1.amazonaws.com
NAME_SERVER := ost_server
NAME_PROXY := ost_proxy
LOCAL_IMG_COMMIT_SERVER := ${NAME_SERVER}:${TAG}
LOCAL_IMG_LATEST_SERVER := ${NAME_SERVER}:latest
LOCAL_IMG_COMMIT_PROXY := ${NAME_PROXY}:${TAG}
LOCAL_IMG_LATEST_PROXY := ${NAME_PROXY}:latest

ECR_ENDPOINT_SERVER := ${ECR_URI}/${NAME_SERVER}
ECR_ENDPOINT_PROXY := ${ECR_URI}/${NAME_PROXY}

ECR_IMG_COMMIT_SERVER := ${ECR_ENDPOINT_SERVER}:${TAG}
ECR_IMG_LATEST_SERVER := ${ECR_ENDPOINT_SERVER}:latest
ECR_IMG_COMMIT_PROXY := ${ECR_ENDPOINT_PROXY}:${TAG}
ECR_IMG_LATEST_PROXY := ${ECR_ENDPOINT_PROXY}:latest

build:
ifeq (${ENV}, test)
	@echo if
	@docker build -f _server.Dockerfile -t ${LOCAL_IMG_COMMIT_SERVER} ../
	@docker build -f _proxy.Dockerfile -t ${LOCAL_IMG_COMMIT_PROXY} ./
else
	@echo elseif
	@docker buildx build --platform=linux/amd64 -f _server.Dockerfile -t ${LOCAL_IMG_COMMIT_SERVER} ../
	@docker buildx build --platform=linux/amd64 -f _proxy.Dockerfile -t ${LOCAL_IMG_COMMIT_PROXY} ./
endif
	@docker tag ${LOCAL_IMG_COMMIT_SERVER} ${LOCAL_IMG_LATEST_SERVER}
	@docker tag ${LOCAL_IMG_COMMIT_PROXY} ${LOCAL_IMG_LATEST_PROXY}

	@docker tag ${LOCAL_IMG_COMMIT_SERVER} ${ECR_IMG_COMMIT_SERVER}
	@docker tag ${LOCAL_IMG_COMMIT_SERVER} ${ECR_IMG_LATEST_SERVER}
	@docker tag ${LOCAL_IMG_COMMIT_PROXY} ${ECR_IMG_COMMIT_PROXY}
	@docker tag ${LOCAL_IMG_COMMIT_PROXY} ${ECR_IMG_LATEST_PROXY}
# 커밋 테스트 용

push:
	@aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 497217256558.dkr.ecr.ap-northeast-1.amazonaws.com
	@docker push ${ECR_IMG_COMMIT_SERVER}
	@docker push ${ECR_IMG_LATEST_SERVER}
	@docker push ${ECR_IMG_COMMIT_PROXY}
	@docker push ${ECR_IMG_LATEST_PROXY}


kill:
	@echo 'Killing container...'
	@docker-compose -f docker-compose.yml -p port-app stop


delete:
	@docker rmi -f $$( docker images --format "{{.ID}} {{.Repository}} {{.Tag}}" | grep ost_server | awk '{print ($$2":"$$3)}')
	@docker rmi -f $$( docker images --format "{{.ID}} {{.Repository}} {{.Tag}}" | grep ost_proxy | awk '{print ($$2":"$$3)}')
	@docker rmi -f $$( docker images --format "{{.ID}} {{.Repository}} {{.Tag}}" | grep none | awk '{print $$1}')