pipeline {
  agent any
  environment {
    def branch = 'master'
}

  stages {
    stage('Get Git Code') {
      steps {
        script {	
        echo 'Obteniendo codigo fuente de Git ' 
        git(url: 'https://github.com/Kakasbal/SlackBot.git', branch:  branch)
                }
      }
    }

     stage('Deploy Code') {
      steps {
        script {
           echo 'Desplegando aplicación para ambiente de ' + branch
		   if (branch=='Desarrollo') {
          echo 'Deploy Dev'
			}
		   if (branch=='QA') {
          echo 'Deploy QA'
			}
		   if (branch=='dev') {
          env.TAG_ON_DEPLOY_PROD = input message: 'Requiere Aprobación',
              parameters: [choice(name: 'Deploy Production', choices: 'no\nyes', description: 'Selecciona "yes" Si esta de acuerdo en publicar en ambiente de Producción ')]
			}					   
                }
            }
     }
    stage('Deploy to production') {
     // when {
     //   environment name: 'TAG_ON_DEPLOY_PROD', value: 'yes'
     // }
      steps {
        script {
		   if (branch=='master') {
           echo 'Deploy production'
           node('DigitalOceanNode'){
            sh('cd /srv/botfull/slack1/SlackBot && git pull origin master && pm2 restart SysBot ')
            sh('cd /srv/botfull/slack1/SlackBot && ls -lrt ')
           }
		   }
                }
      }
    }
  }
}
