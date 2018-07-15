pipeline {
  agent any
  stages {
    stage('Git') {
      steps {
        script {	  
        echo 'Obteniendo codigo fuente de Git rama ' + env.BRANCH_NAME
        git(url: 'https://github.com/Kakasbal/SlackBot.git', branch:  env.BRANCH_NAME)
                }
      }
    }

     stage('Desplegando...') {
      steps {
        script {
           echo 'Desplegando aplicación para ambiente de ' + env.BRANCH_NAME
		   if (env.BRANCH_NAME=='Desarrollo') {
           sh 'ant desplegarDev -Dconfigplan=/deploy/MasterRuleEngine/soaconfigplan.xml -DsarLocation=/deploy/artefactos/sca_MasterRuleEngine_rev1.0.jar -Doverwrite=true -DforceDefault=true -Dpartition=PVSO2 -Druta=/deploy/MasterRuleEngine'
			}
		   if (env.BRANCH_NAME=='QA') {
           sh 'ant desplegarQA -Dconfigplan=/deploy/MasterRuleEngine/soaconfigplan.xml -DsarLocation=/deploy/artefactos/sca_MasterRuleEngine_rev1.0.jar -Doverwrite=true -DforceDefault=true -Dpartition=PVSO2 -Druta=/deploy/MasterRuleEngine'
			}
		   if (env.BRANCH_NAME=='master') {
          env.TAG_ON_DEPLOY_PROD = input message: 'Requiere Aprobación',
              parameters: [choice(name: 'Desplegando en produccion', choices: 'no\nyes', description: 'Selecciones "yes" Si esta de acuerdo en publicar en ambiente de Producción ')]
			}					   
                }
            }
     }
    stage('Desplegando en produccion') {
      when {
        environment name: 'TAG_ON_DEPLOY_PROD', value: 'yes'
      }
      steps {
        script {
           echo 'Desplegando aplicación para ambiente de ' + env.BRANCH_NAME
		   if (env.BRANCH_NAME=='Master') {
           sh 'ant desplegarProd -Dconfigplan=/deploy/MasterRuleEngine/soaconfigplan.xml -DsarLocation=/deploy/artefactos/sca_MasterRuleEngine_rev1.0.jar -Doverwrite=true -DforceDefault=true -Dpartition=PVSO2 -Druta=/deploy/MasterRuleEngine'
		   }
                }
      }
    }
  }
}
