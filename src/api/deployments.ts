export interface Deployment { name: string; namespace: string; replicas: number; image: string; ports: number[]; env: Record<string, string>; resources: { cpu: string; memory: string }; strategy: 'rolling' | 'recreate'; }
export interface Service { name: string; type: 'ClusterIP' | 'NodePort' | 'LoadBalancer'; ports: { port: number; targetPort: number; protocol: string }[]; selector: Record<string, string>; }
export function generateDeploymentYaml(deployment: Deployment): string { return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${deployment.name}
  namespace: ${deployment.namespace}
spec:
  replicas: ${deployment.replicas}
  selector:
    matchLabels:
      app: ${deployment.name}
  template:
    metadata:
      labels:
        app: ${deployment.name}
    spec:
      containers:
      - name: ${deployment.name}
        image: ${deployment.image}
        ports:
${deployment.ports.map(p => `        - containerPort: ${p}`).join('\n')}`; }
export function generateServiceYaml(service: Service): string { return `apiVersion: v1
kind: Service
metadata:
  name: ${service.name}
spec:
  type: ${service.type}
  ports:
${service.ports.map(p => `  - port: ${p.port}
    targetPort: ${p.targetPort}
    protocol: ${p.protocol}`).join('\n')}
  selector:
${Object.entries(service.selector).map(([k, v]) => `    ${k}: ${v}`).join('\n')}`; }
