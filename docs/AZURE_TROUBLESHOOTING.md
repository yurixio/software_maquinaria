# 🔧 Solución de Problemas - Azure Deployment

## Problema: Aplicación se cierra automáticamente

### Síntomas observados:
```
INFO  Accepting connections at http://localhost:8080
HTTP  6/14/2025 6:58:23 AM 169.254.130.1 GET /robots933456.txt
HTTP  6/14/2025 6:58:23 AM 169.254.130.1 Returned 404 in 251 ms
INFO  Gracefully shutting down. Please wait...
Terminated
```

## 🚨 Soluciones Inmediatas

### 1. Verificar configuración del App Service

```bash
# Verificar el estado actual
az webapp show --name tu-app-name --resource-group tu-resource-group --query "state"

# Verificar la configuración de startup
az webapp config show --name tu-app-name --resource-group tu-resource-group
```

### 2. Configurar el comando de inicio correcto

```bash
# Configurar startup command
az webapp config set \
  --name tu-app-name \
  --resource-group tu-resource-group \
  --startup-file "npm start"
```

### 3. Verificar package.json

Asegúrate de que tu `package.json` tenga:

```json
{
  "scripts": {
    "start": "serve -s dist -l 8080",
    "build": "npm run build && npm run build:server",
    "serve": "serve -s dist"
  },
  "dependencies": {
    "serve": "^14.2.0"
  }
}
```

### 4. Crear web.config para Node.js

Crea un archivo `web.config` en la raíz:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="server.js" verb="*" modules="iisnode"/>
    </handlers>
    <rewrite>
      <rules>
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}"/>
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
          </conditions>
          <action type="Rewrite" url="server.js"/>
        </rule>
      </rules>
    </rewrite>
    <security>
      <requestFiltering>
        <hiddenSegments>
          <remove segment="bin"/>
        </hiddenSegments>
      </requestFiltering>
    </security>
    <httpErrors existingResponse="PassThrough" />
    <iisnode watchedFiles="web.config;*.js"/>
  </system.webServer>
</configuration>
```

## 🔄 Solución Completa: Reconfigurar el Despliegue

### Paso 1: Crear servidor Express optimizado

Crea `server.js` en la raíz:

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Puerto dinámico de Azure
const port = process.env.PORT || 8080;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes (si las tienes)
app.use('/api', (req, res) => {
  res.json({ message: 'API funcionando' });
});

// Catch all handler: enviar index.html para rutas SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Manejar señales de cierre graceful
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

const server = app.listen(port, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${port}`);
  console.log(`📱 Aplicación disponible en: http://localhost:${port}`);
  console.log(`🏥 Health check: http://localhost:${port}/health`);
});

// Keep alive para evitar que Azure cierre la app
setInterval(() => {
  console.log(`💓 Keep alive - ${new Date().toISOString()}`);
}, 25 * 60 * 1000); // Cada 25 minutos
```

### Paso 2: Actualizar package.json

```json
{
  "name": "heavy-machinery-rental-system",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "node server.js",
    "build:prod": "npm run build && npm run copy-server",
    "copy-server": "cp server.js dist/ && cp package.json dist/",
    "deploy": "npm run build:prod"
  },
  "dependencies": {
    "express": "^4.18.2",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.20.1"
  }
}
```

### Paso 3: Comandos de Azure para reconfigurar

```bash
# 1. Detener la aplicación
az webapp stop --name tu-app-name --resource-group tu-resource-group

# 2. Configurar variables de entorno
az webapp config appsettings set \
  --name tu-app-name \
  --resource-group tu-resource-group \
  --settings \
    WEBSITE_NODE_DEFAULT_VERSION="18.17.0" \
    NODE_ENV="production" \
    PORT="8080" \
    WEBSITE_RUN_FROM_PACKAGE="1"

# 3. Configurar startup command
az webapp config set \
  --name tu-app-name \
  --resource-group tu-resource-group \
  --startup-file "node server.js"

# 4. Habilitar logging
az webapp log config \
  --name tu-app-name \
  --resource-group tu-resource-group \
  --application-logging filesystem \
  --level information

# 5. Reiniciar la aplicación
az webapp start --name tu-app-name --resource-group tu-resource-group
```

### Paso 4: Redesplegar la aplicación

```bash
# Construir la aplicación
npm run build:prod

# Crear ZIP para despliegue
zip -r deploy.zip dist/ server.js package.json web.config

# Desplegar
az webapp deployment source config-zip \
  --name tu-app-name \
  --resource-group tu-resource-group \
  --src deploy.zip
```

## 🔍 Verificación y Monitoreo

### 1. Verificar que la app esté corriendo

```bash
# Ver logs en tiempo real
az webapp log tail --name tu-app-name --resource-group tu-resource-group

# Verificar estado
az webapp show --name tu-app-name --resource-group tu-resource-group --query "state"
```

### 2. Probar endpoints

```bash
# Health check
curl https://tu-app-name.azurewebsites.net/health

# Aplicación principal
curl https://tu-app-name.azurewebsites.net/
```

### 3. Configurar Always On (Importante)

```bash
# Habilitar Always On para evitar que se duerma
az webapp config set \
  --name tu-app-name \
  --resource-group tu-resource-group \
  --always-on true
```

## 🚨 Si el problema persiste

### Opción 1: Usar App Service con contenedor

```bash
# Crear Dockerfile
cat > Dockerfile << EOF
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]
EOF

# Desplegar como contenedor
az webapp create \
  --resource-group tu-resource-group \
  --plan tu-app-service-plan \
  --name tu-app-name \
  --deployment-container-image-name node:18-alpine
```

### Opción 2: Usar Azure Static Web Apps

```bash
# Para aplicaciones React puras (sin backend)
az staticwebapp create \
  --name tu-app-name \
  --resource-group tu-resource-group \
  --source https://github.com/tu-usuario/tu-repo \
  --location "Central US" \
  --branch main \
  --app-location "/" \
  --output-location "dist"
```

## 📊 Monitoreo Continuo

### Configurar alertas

```bash
# Alerta cuando la app se reinicia
az monitor activity-log alert create \
  --name "App Restart Alert" \
  --resource-group tu-resource-group \
  --condition category=Administrative operationName=Microsoft.Web/sites/restart/action \
  --description "Alert when web app restarts"
```

### Script de monitoreo

Crea `monitor.sh`:

```bash
#!/bin/bash
APP_URL="https://tu-app-name.azurewebsites.net/health"

while true; do
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $APP_URL)
  if [ $RESPONSE -eq 200 ]; then
    echo "✅ App OK - $(date)"
  else
    echo "❌ App DOWN - Response: $RESPONSE - $(date)"
    # Reiniciar si es necesario
    az webapp restart --name tu-app-name --resource-group tu-resource-group
  fi
  sleep 300  # Verificar cada 5 minutos
done
```

## 🎯 Checklist de Verificación

- [ ] ✅ `server.js` creado con Express
- [ ] ✅ `package.json` actualizado con script "start"
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Startup command configurado
- [ ] ✅ Always On habilitado
- [ ] ✅ Logging habilitado
- [ ] ✅ Health check endpoint funcionando
- [ ] ✅ Aplicación desplegada y corriendo
- [ ] ✅ Monitoreo configurado

Con estos cambios, tu aplicación debería mantenerse ejecutándose de forma estable en Azure.