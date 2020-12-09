# Kubernetes Sample App

`app` contains a small Node.js application that returns the hostname of the environment the application is running on along with a Dockerfile to containerize the application.

`test-deployment.yaml` creates the Kubernetes deployment with 4 instances of the Node.js application.

`test-service.yaml` creates the load balancing service to distribute requests to the 4 pods created in the deployment.

## How to run

These instructions are written assuming you have Docker, Minikube, and Kubectl installed on your machine.

1. Start by cloning this repo and cd into the directory.

2. Once inside the directory start Minikube using `minikube start`.

3. Before we build the Docker image we will need to point the local Docker environment to Minikube by running `eval $(minikube docker-env)`.

4. Now we can build our Docker image. I will be using the container name `test` but feel free to name the container how you'd like, just remember to modify the container image line in the `test-deployment.yaml` file.

   Run the command `docker build -t test ./app`.

5. Once the container is built we can apply our deployment and service yaml files with `kubectl apply -f .`

   The output we should see will look like

   ```
   % kubectl apply -f .
   deployment.apps/test-app created
   service/test-app created
   ```

6. We use the `kubectl get deployments` command to verify everthing was successful.

   ```
   % kubectl get deployments
   NAME       READY   UP-TO-DATE   AVAILABLE   AGE
   test-app   4/4     4            4           93s
   ```

7. To check the pods use the command `kubectl get pods`

   ```
   % kubectl get pods
   NAME                       READY   STATUS    RESTARTS   AGE
   test-app-58ff895c4-6ztwg   1/1     Running   0          3m11s
   test-app-58ff895c4-mtjl9   1/1     Running   0          3m11s
   test-app-58ff895c4-n8rjm   1/1     Running   0          3m11s
   test-app-58ff895c4-st8k2   1/1     Running   0          3m11s
   ```

8. To check the services use the command `kubectl get services`

   ```
   % kubectl get services
   NAME         TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
   kubernetes   ClusterIP      10.96.0.1      <none>        443/TCP        222d
   test-app     LoadBalancer   10.96.79.230   <pending>     80:31659/TCP   4m11s
   ```

9. From the output above we can see that we have all 4 pods up and running as well as the load balancing service exposing access to the pods.

   We can get the url of the service with `minikube service test-app --url`.

10. You can either use the browser or curl to view the output:

    ```
    % curl http://192.168.41.130:31659
    test-app-58ff895c4-mtjl9

    % curl http://192.168.41.130:31659
    test-app-58ff895c4-st8k2

    curl http://192.168.41.130:31659
    test-app-58ff895c4-n8rjm

    curl http://192.168.41.130:31659
    test-app-58ff895c4-6ztwg
    ```

    I ran 4 requests to the application and looking at the output you can see that each request matches to the hostname of one of our pods in the output from the `kubectl get pods` command that was run earlier.

11. To stop the deployments and service run the commands `kubectl delete deployments test-app` and `kubectl delete services test-app`.

    ```
    % kubectl delete deployments test-app
    deployment.apps "test-app" deleted

    % kubectl delete services test-app
    service "test-app" deleted
    ```

12. To stop the Minikube service run `minikube stop`.