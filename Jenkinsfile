pipeline {
  agent any

  environment {
    DOCKER_REGISTRY = 'registry.ontryst.com'
    REPO_NAME = 'geolocation-app'
  }

  stages {
    stage('Setup') {
      steps {
        script {
          // Generate a timestamp for the Docker image tag
          env.TIMESTAMP = new Date().format("yyMMddHHmm", TimeZone.getTimeZone('UTC'))
        }
      }
    }

    stage('Build') {
      steps {
        script {
          // Build and tag the Docker image
          docker.build("${DOCKER_REGISTRY}/${REPO_NAME}:latest")
          docker.build("${DOCKER_REGISTRY}/${REPO_NAME}:${env.TIMESTAMP}")
        }
      }
    }

    stage('Push') {
      steps {
        script {
          // Push the Docker image to the registry
          docker.image("${DOCKER_REGISTRY}/${REPO_NAME}:latest").push()
          docker.image("${DOCKER_REGISTRY}/${REPO_NAME}:${env.TIMESTAMP}").push()
        }
      }
    }

    stage('Deploy') {
      steps {
        script {
          // Update the Kubernetes deployment configuration file
          sh "sed -i 's|container_image|${DOCKER_REGISTRY}/${REPO_NAME}:${env.TIMESTAMP}|g' k8s/deploy.yml"
          sh "cat k8s/deploy.yml"

          // Deploy the application to Kubernetes
          sh "kubectl apply -f k8s/deploy.yml"
        }
      }
    }
  }

  post {
    always {
      // Clean up workspace after build
      cleanWs()
    }
  }
}
