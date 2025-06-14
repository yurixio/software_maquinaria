# Guía de Despliegue en Microsoft Azure

## Sistema de Gestión de Maquinaria Pesada - MaquiRent

Esta guía te llevará paso a paso para desplegar tu aplicación React/TypeScript en Microsoft Azure con una base de datos SQL integrada.

## 📋 Prerrequisitos

### 1. Herramientas necesarias
- **Cuenta de Microsoft Azure** (con suscripción activa)
- **Azure CLI** instalado en tu computadora
- **Node.js** (versión 18 o superior)
- **Git** configurado
- **Visual Studio Code** (recomendado)

### 2. Instalación de Azure CLI

#### Windows:
```bash
# Descargar e instalar desde: https://aka.ms/installazurecliwindows
# O usar Chocolatey:
choco install azure-cli
```

#### macOS:
```bash
brew install azure-cli
```

#### Linux (Ubuntu/Debian):
```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### 3. Verificar instalación
```bash
az --version
az login
```

## 🗄️ Paso 1: Configuración de la Base de Datos

### 1.1 Crear Azure SQL Database

1. **Acceder al Portal Azure**
   - Ve a [portal.azure.com](https://portal.azure.com)
   - Inicia sesión con tu cuenta

2. **Crear Grupo de Recursos**
   ```bash
   az group create --name rg-maquirent --location "East US"
   ```

3. **Crear SQL Server**
   ```bash
   az sql server create \
     --name maquirent-sql-server \
     --resource-group rg-maquirent \
     --location "East US" \
     --admin-user maquirent_admin \
     --admin-password "TuPassword123!"
   ```

4. **Crear Base de Datos**
   ```bash
   az sql db create \
     --resource-group rg-maquirent \
     --server maquirent-sql-server \
     --name maquirent_db \
     --service-objective Basic
   ```

5. **Configurar Firewall**
   ```bash
   # Permitir servicios de Azure
   az sql server firewall-rule create \
     --resource-group rg-maquirent \
     --server maquirent-sql-server \
     --name AllowAzureServices \
     --start-ip-address 0.0.0.0 \
     --end-ip-address 0.0.0.0

   # Permitir tu IP actual
   az sql server firewall-rule create \
     --resource-group rg-maquirent \
     --server maquirent-sql-server \
     --name AllowMyIP \
     --start-ip-address $(curl -s https://ipinfo.io/ip) \
     --end-ip-address $(curl -s https://ipinfo.io/ip)
   ```

### 1.2 Obtener Cadena de Conexión

```bash
az sql db show-connection-string \
  --client ado.net \
  --name maquirent_db \
  --server maquirent-sql-server
```

**Ejemplo de cadena de conexión:**
```
Server=tcp:maquirent-sql-server.database.windows.net,1433;Initial Catalog=maquirent_db;Persist Security Info=False;User ID=maquirent_admin;Password=TuPassword123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

## 🚀 Paso 2: Preparación del Código

### 2.1 Configurar Variables de Entorno

Crea un archivo `.env.production`:

```env
# Base de datos
DATABASE_URL="Server=tcp:maquirent-sql-server.database.windows.net,1433;Initial Catalog=maquirent_db;Persist Security Info=False;User ID=maquirent_admin;Password=TuPassword123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

# Configuración de la aplicación
NODE_ENV=production
VITE_API_URL=https://maquirent-app.azurewebsites.net/api
VITE_APP_NAME="MaquiRent - Sistema de Gestión"

# Azure Storage (para archivos)
AZURE_STORAGE_ACCOUNT_NAME=maquirentstorage
AZURE_STORAGE_ACCOUNT_KEY=tu_storage_key

# Configuración de autenticación
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRES_IN=24h

# Configuración de email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_password_app
```

### 2.2 Actualizar package.json

Agrega scripts de despliegue:

```json
{
  "scripts": {
    "build:azure": "npm run build && npm run build:server",
    "build:server": "tsc -p tsconfig.server.json",
    "start:prod": "node dist/server.js",
    "deploy": "az webapp deployment source config-zip --resource-group rg-maquirent --name maquirent-app --src deploy.zip"
  }
}
```

### 2.3 Crear Servidor Express (Backend)

Crea `server/index.ts`:

```typescript
import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
app.use('/api', require('./routes'));

// Catch all handler: send back React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 App URL: http://localhost:${PORT}`);
});
```

### 2.4 Configurar TypeScript para el servidor

Crea `tsconfig.server.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./server",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["server/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 🌐 Paso 3: Despliegue de la Aplicación

### 3.1 Crear App Service

```bash
# Crear App Service Plan
az appservice plan create \
  --name maquirent-plan \
  --resource-group rg-maquirent \
  --sku B1 \
  --is-linux

# Crear Web App
az webapp create \
  --resource-group rg-maquirent \
  --plan maquirent-plan \
  --name maquirent-app \
  --runtime "NODE|18-lts"
```

### 3.2 Configurar Variables de Entorno en Azure

```bash
az webapp config appsettings set \
  --resource-group rg-maquirent \
  --name maquirent-app \
  --settings \
    NODE_ENV=production \
    DATABASE_URL="Server=tcp:maquirent-sql-server.database.windows.net,1433;Initial Catalog=maquirent_db;Persist Security Info=False;User ID=maquirent_admin;Password=TuPassword123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;" \
    VITE_API_URL=https://maquirent-app.azurewebsites.net/api \
    JWT_SECRET=tu_jwt_secret_muy_seguro
```

### 3.3 Configurar Despliegue desde Git

#### Opción A: Despliegue desde GitHub

```bash
az webapp deployment source config \
  --resource-group rg-maquirent \
  --name maquirent-app \
  --repo-url https://github.com/tu-usuario/maquirent \
  --branch main \
  --manual-integration
```

#### Opción B: Despliegue local con ZIP

```bash
# Construir la aplicación
npm run build:azure

# Crear archivo ZIP
zip -r deploy.zip dist/ package.json package-lock.json server/ node_modules/

# Desplegar
az webapp deployment source config-zip \
  --resource-group rg-maquirent \
  --name maquirent-app \
  --src deploy.zip
```

### 3.4 Configurar Startup Command

```bash
az webapp config set \
  --resource-group rg-maquirent \
  --name maquirent-app \
  --startup-file "npm run start:prod"
```

## 📁 Paso 4: Configurar Azure Storage (Archivos)

### 4.1 Crear Storage Account

```bash
az storage account create \
  --name maquirentstorage \
  --resource-group rg-maquirent \
  --location "East US" \
  --sku Standard_LRS
```

### 4.2 Crear Containers

```bash
# Obtener connection string
STORAGE_CONNECTION=$(az storage account show-connection-string \
  --name maquirentstorage \
  --resource-group rg-maquirent \
  --output tsv)

# Crear containers
az storage container create \
  --name machinery-images \
  --connection-string $STORAGE_CONNECTION \
  --public-access blob

az storage container create \
  --name documents \
  --connection-string $STORAGE_CONNECTION \
  --public-access blob

az storage container create \
  --name attachments \
  --connection-string $STORAGE_CONNECTION \
  --public-access blob
```

## 🔧 Paso 5: Configuración de Dominio Personalizado (Opcional)

### 5.1 Configurar Dominio

```bash
# Agregar dominio personalizado
az webapp config hostname add \
  --resource-group rg-maquirent \
  --webapp-name maquirent-app \
  --hostname maquirent.tudominio.com
```

### 5.2 Configurar SSL

```bash
# Crear certificado SSL gratuito
az webapp config ssl create \
  --resource-group rg-maquirent \
  --name maquirent-app \
  --hostname maquirent.tudominio.com
```

## 📊 Paso 6: Monitoreo y Logs

### 6.1 Habilitar Application Insights

```bash
az monitor app-insights component create \
  --app maquirent-insights \
  --location "East US" \
  --resource-group rg-maquirent \
  --application-type web
```

### 6.2 Ver Logs en Tiempo Real

```bash
az webapp log tail \
  --resource-group rg-maquirent \
  --name maquirent-app
```

### 6.3 Configurar Alertas

```bash
# Alerta por alto uso de CPU
az monitor metrics alert create \
  --name "High CPU Usage" \
  --resource-group rg-maquirent \
  --scopes /subscriptions/{subscription-id}/resourceGroups/rg-maquirent/providers/Microsoft.Web/sites/maquirent-app \
  --condition "avg Percentage CPU > 80" \
  --description "Alert when CPU usage is high"
```

## 🔒 Paso 7: Seguridad y Backup

### 7.1 Configurar Backup Automático

```bash
# Crear storage account para backups
az storage account create \
  --name maquirentbackups \
  --resource-group rg-maquirent \
  --location "East US" \
  --sku Standard_LRS

# Configurar backup
az webapp config backup update \
  --resource-group rg-maquirent \
  --webapp-name maquirent-app \
  --container-url "https://maquirentbackups.blob.core.windows.net/backups" \
  --frequency 1 \
  --retain-one true \
  --retention 30
```

### 7.2 Configurar Autenticación (Opcional)

```bash
az webapp auth update \
  --resource-group rg-maquirent \
  --name maquirent-app \
  --enabled true \
  --action LoginWithAzureActiveDirectory
```

## 🧪 Paso 8: Testing y Verificación

### 8.1 Verificar Despliegue

```bash
# Verificar estado de la aplicación
az webapp show \
  --resource-group rg-maquirent \
  --name maquirent-app \
  --query state

# Verificar URL
echo "Tu aplicación está disponible en: https://maquirent-app.azurewebsites.net"
```

### 8.2 Pruebas de Conectividad

```bash
# Probar conexión a la base de datos
az sql db show \
  --resource-group rg-maquirent \
  --server maquirent-sql-server \
  --name maquirent_db
```

### 8.3 Verificar Logs

```bash
# Ver logs de la aplicación
az webapp log download \
  --resource-group rg-maquirent \
  --name maquirent-app
```

## 📈 Paso 9: Optimización y Escalado

### 9.1 Configurar Auto-scaling

```bash
az monitor autoscale create \
  --resource-group rg-maquirent \
  --resource /subscriptions/{subscription-id}/resourceGroups/rg-maquirent/providers/Microsoft.Web/serverfarms/maquirent-plan \
  --name autoscale-maquirent \
  --min-count 1 \
  --max-count 3 \
  --count 1
```

### 9.2 Configurar CDN (Opcional)

```bash
az cdn profile create \
  --resource-group rg-maquirent \
  --name maquirent-cdn \
  --sku Standard_Microsoft

az cdn endpoint create \
  --resource-group rg-maquirent \
  --profile-name maquirent-cdn \
  --name maquirent-endpoint \
  --origin maquirent-app.azurewebsites.net
```

## 🔄 Paso 10: CI/CD con GitHub Actions

Crea `.github/workflows/azure-deploy.yml`:

```yaml
name: Deploy to Azure

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build application
      run: npm run build:azure
      
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'maquirent-app'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: .
```

## 📋 Checklist Final

- [ ] ✅ Base de datos SQL creada y configurada
- [ ] ✅ App Service desplegado y funcionando
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Storage Account para archivos configurado
- [ ] ✅ SSL/HTTPS habilitado
- [ ] ✅ Monitoreo y alertas configurados
- [ ] ✅ Backup automático configurado
- [ ] ✅ Dominio personalizado (opcional)
- [ ] ✅ CI/CD pipeline configurado
- [ ] ✅ Pruebas de funcionalidad completadas

## 🆘 Solución de Problemas Comunes

### Error de conexión a la base de datos
```bash
# Verificar firewall rules
az sql server firewall-rule list \
  --resource-group rg-maquirent \
  --server maquirent-sql-server
```

### Aplicación no inicia
```bash
# Verificar logs
az webapp log tail \
  --resource-group rg-maquirent \
  --name maquirent-app
```

### Problemas de memoria
```bash
# Escalar el App Service Plan
az appservice plan update \
  --name maquirent-plan \
  --resource-group rg-maquirent \
  --sku B2
```

## 💰 Estimación de Costos Mensuales

| Servicio | Configuración | Costo Estimado (USD) |
|----------|---------------|---------------------|
| App Service (B1) | 1 instancia | $13.14 |
| SQL Database (Basic) | 5 DTU | $4.90 |
| Storage Account | 100GB | $2.40 |
| Application Insights | Básico | $2.30 |
| **Total Estimado** | | **~$23/mes** |

## 📞 Soporte y Recursos

- **Documentación Azure**: [docs.microsoft.com/azure](https://docs.microsoft.com/azure)
- **Azure CLI Reference**: [docs.microsoft.com/cli/azure](https://docs.microsoft.com/cli/azure)
- **Soporte Azure**: [azure.microsoft.com/support](https://azure.microsoft.com/support)

---

¡Tu aplicación MaquiRent ahora está desplegada en Azure! 🎉

Para cualquier problema o pregunta adicional, consulta los logs y la documentación oficial de Azure.