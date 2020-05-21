// https://jenkins.io/zh/doc/book/pipeline/syntax/#%E5%B9%B6%E8%A1%8C
node {
  checkout scm
  PORJECT_NAME = "service-platform-rce.sunmi.com"
  SUNMI_ENV = "${env.BRANCH_NAME}"
  BUILD_TAG = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()

  if (SUNMI_ENV ==~ '(dev|test|uat)') {
    IMAGE_TAG = "${SUNMI_ENV}"
    SSH_CONFIGNAME = "${SUNMI_ENV}-service-platform-rce.sunmi.com"
  } else {
    IMAGE_TAG = "${SUNMI_ENV}-${BUILD_TAG}"
    SSH_CONFIGNAME = "service-platform-rce.sunmi.com"
  }

  SSH_EXCLUDES = ''
  SSH_SOURCEFILES = 'docker-compose.yml'

  // 目标目录为/data/www/
  // SSH_REMOTE_COMMAND = "echo hello"
  SSH_REMOTE_COMMAND = "cd /data/www/$PORJECT_NAME && \
    docker-compose down && \
    IMAGE_TAG=${IMAGE_TAG} docker-compose pull app && \
    IMAGE_TAG=${IMAGE_TAG} SP_ENV=${SUNMI_ENV} docker-compose up -d"

  // 整理环境变量
  stage('Prepare SCM') {
    echo "当前 Git COMMIT_ID为： ${BUILD_TAG} 当前 SUNMI_ENV 为： ${SUNMI_ENV}"
    echo "IMAGE_TAG : ${IMAGE_TAG}"
    echo "整理环境变量, 拉取分支"
    echo "SSH_CONFIGNAME : ${SSH_CONFIGNAME}"
    echo "SSH_SOURCEFILES : ${SSH_SOURCEFILES}"
    echo "SSH_EXCLUDES : ${SSH_EXCLUDES}"
    echo "SSH_REMOTE_COMMAND : ${SSH_REMOTE_COMMAND}"
  }

  // 按环境变量打包
  stage('Build') {
    echo "安装基本依赖，按环境变量打包"
    def nodejs = docker.image('node:latest')
    nodejs.inside {
      sh "npm i"
      sh "npm run build-${SUNMI_ENV}"
    }
  }

  // Push镜像到Docker
  // https://docker-hlcx.sunmi.com/
  stage('Push') {
    echo "推送镜像 ${IMAGE_TAG} 到 docker-hlcx"
    echo "打包镜像 ${IMAGE_TAG}..."
    def appImage = docker.build("docker-hlcx.sunmi.com/service-platform-rce.sunmi.com:${IMAGE_TAG}")
    echo "${IMAGE_TAG} Build完毕！！"
    appImage.push()
    echo "${IMAGE_TAG} Push完毕！！"
  }
  
  stage('Sanity check') {
    if (SUNMI_ENV != 'dev') {
      input "确认要部署吗？"
    }
  }

  // SSH登录远端拉取镜像
  stage('Deploy') {
    sshPublisher(
      publishers: [
        sshPublisherDesc(
          configName: SSH_CONFIGNAME,
          transfers: [
            sshTransfer(
              cleanRemote: true,
              execCommand: SSH_REMOTE_COMMAND,
              patternSeparator: '[, ]+',
              remoteDirectory: PORJECT_NAME,
              excludes: SSH_EXCLUDES,
              sourceFiles: SSH_SOURCEFILES,
              makeEmptyDirs: true
            )
          ],
        )
      ]
    )
  }
}
