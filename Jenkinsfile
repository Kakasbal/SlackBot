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
        sh 'sshpass -p ''maco.2018''  ssh root@206.189.193.99 df -h ' 
		   }
                }
      }
    }
  }
}
