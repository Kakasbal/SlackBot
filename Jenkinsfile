pipeline {
  agent any
  stages {
    stage('Git') {
      steps {
        script {	  
        echo 'Obteniendo codigo fuente de Git rama ' + env.BRANCH_NAME
        git(url: 'https://gitlab-bsd.tigo.com.gt/CRM/MDW/SCA_LOCAL/OSM/MasterRuleEngine.git', branch:  env.BRANCH_NAME)
                }
      }
    }
    stage('Compilar') {
      steps {
        script {
           echo 'Compilando aplicación para ambiente de ' + env.BRANCH_NAME
		   if (env.BRANCH_NAME=='Desarrollo') {
           sh 'ant compliaProyecto -Druta=/deploy/MasterRuleEngine -Dsca.input=/deploy/MasterRuleEngine/composite.xml'
			}
		   if (env.BRANCH_NAME=='QA') {
           sh 'ant compliaProyecto -Druta=/deploy/MasterRuleEngine -Dsca.input=/deploy/MasterRuleEngine/composite.xml'
			}
		   if (env.BRANCH_NAME=='master') {
           sh 'ant compliaProyecto -Druta=/deploy/MasterRuleEngine -Dsca.input=/deploy/MasterRuleEngine/composite.xml'
			}			
                }
        }
     }
     stage('Generando Jar') {
      steps {
        script {
           echo 'Compilando aplicación para ambiente de ' + env.BRANCH_NAME
		   if (env.BRANCH_NAME=='Desarrollo') {
           sh 'ant GenerarJar -DcompositeDir=/deploy/MasterRuleEngine -DcompositeName=MasterRuleEngine -Drevision=1.0 -Druta=/deploy/MasterRuleEngine'
		   }
		   if (env.BRANCH_NAME=='QA') {
           sh 'ant GenerarJar -DcompositeDir=/deploy/MasterRuleEngine -DcompositeName=MasterRuleEngine -Drevision=1.0 -Druta=/deploy/MasterRuleEngine'
			}
		   if (env.BRANCH_NAME=='master') {
           sh 'ant GenerarJar -DcompositeDir=/deploy/MasterRuleEngine -DcompositeName=MasterRuleEngine -Drevision=1.0 -Druta=/deploy/MasterRuleEngine'
			}					   
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
    stage('Save Artifactory') {
      steps {
        script {
           def server = Artifactory.server 'ArtifactoryBSD'			
		   if (env.BRANCH_NAME=='Desarrollo') {
           echo 'Almacenando el artefacto para despliegue de '+env.BRANCH_NAME
           def uploadSpec = """{
              "files": [
                    {
                "pattern": "/deploy/artefactos/sca_MasterRuleEngine*jar",
                 "target": "CRM-MDW-SCA_LOCAL-OSM-DEV/"
                        }
                     ]
                    }"""
                    server.upload(uploadSpec)	
			}
		   if (env.BRANCH_NAME=='QA') {
           echo 'Almacenando el artefacto para despliegue de '+env.BRANCH_NAME		   
           def uploadSpec = """{
              "files": [
                    {
                "pattern": "/deploy/artefactos/sca_MasterRuleEngine*jar",
                 "target": "CRM-MDW-SCA_LOCAL-OSM-QA/"
                        }				
                     ]
                    }"""
                    server.upload(uploadSpec)					
			}
		   if (env.BRANCH_NAME=='master') {
           echo 'Almacenando el artefacto para despliegue de '+env.BRANCH_NAME		   
           def uploadSpec = """{
              "files": [
                    {
                "pattern": "/deploy/artefactos/sca_MasterRuleEngine*jar",
                 "target": "CRM-MDW-SCA_LOCAL-OSM-PROD/"
                        }					
                     ]
                    }"""
                    server.upload(uploadSpec)					
			}			   
                }
            }
     }
     stage('Eliminando temporales ....') {
      steps {
        script {
           sh 'ant clean -Druta=/deploy/MasterRuleEngine'
                }
            }
     }	 
  }
}
