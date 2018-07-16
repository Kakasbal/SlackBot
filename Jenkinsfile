pipeline {
  agent any
  stages {
    def branch = 'master'
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
              parameters: [choice(name: 'Desplegando en produccion', choices: 'no\nyes', description: 'Selecciones "yes" Si esta de acuerdo en publicar en ambiente de Producción ')]
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
           echo 'Desplegando aplicación para ambiente de ' + branch
		   if (branch=='Master') {
           echo 'Deploy Produccion'
		   }
                }
      }
    }
  }
}
