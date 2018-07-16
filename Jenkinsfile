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
		   if (branch=='master') {
          env.TAG_ON_DEPLOY_PROD = input message: 'Requiere Aprobación',
              parameters: [choice(name: 'Deploy Production', choices: 'no\nyes', description: 'Selecciona "yes" Si esta de acuerdo en publicar en ambiente de Producción ')]
			}					   
                }
            }
     }
    stage('Deploy to production') {
      when {
        environment name: 'TAG_ON_DEPLOY_PROD', value: 'yes'
      }
      steps {
        script {
		   if (branch=='master') {
           echo 'Deploy production'
        sshagent (credentials: ['ee8cef05-eed1-4638-9e43-39750747195d']) {
       sh 'ssh -o StrictHostKeyChecking=no -l root 206.189.193.99 uname -a'
        }
		   }
                }
      }
    }
  }
}
