pipeline {
  agent any
  stages {
    stage('Get Git Code') {
      steps {
        script {	
          def getGitBranchName() {
    return scm.branches[0].name
}  
        echo 'Obteniendo codigo fuente de Git ' + getGitBranchName()
        git(url: 'https://github.com/Kakasbal/SlackBot.git', branch:  env.BRANCH_NAME)
                }
      }
    }

     stage('Deploy Code') {
      steps {
        script {
           echo 'Desplegando aplicación para ambiente de ' + env.BRANCH_NAME
		   if (env.BRANCH_NAME=='Desarrollo') {
          echo 'Deploy Dev'
			}
		   if (env.BRANCH_NAME=='QA') {
          echo 'Deploy QA'
			}
		   if (env.BRANCH_NAME=='master') {
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
           echo 'Desplegando aplicación para ambiente de ' + env.BRANCH_NAME
		   if (env.BRANCH_NAME=='Master') {
           echo 'Deploy Produccion'
		   }
                }
      }
    }
  }
}
