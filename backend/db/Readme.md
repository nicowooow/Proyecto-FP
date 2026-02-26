Notas críticas sobre tablas base y eliminación de registros

En esta base de datos existen tablas estructurales cuya modificación o eliminación puede causar graves problemas de integridad o funcionamiento en todo el sistema.

roles:
    Esta tabla define los permisos y tipos de usuario. Si se elimina (o se borran ciertos roles presentes en la tabla users), todos los usuarios perderán su categoría y los controles de acceso dejarán de funcionar correctamente.

users:
    Es la base de todas las cuentas. Su eliminación podría provocar la falta de referencias clave y vuelve inutilizable cualquier relación con perfiles, pagos y mensajes.

payment_plans:
    Se utiliza como referencia en los perfiles y pagos. Si borras un plan que está en uso, dependiendo de la configuración (por ejemplo, ON DELETE SET DEFAULT), los perfiles afectados cambiarán al plan por defecto si existe. Nunca elimines el plan básico (típicamente con id=1), ya que muchos perfiles dependen de él como valor seguro — hacerlo puede quebrar la integridad referencial y lanzar errores críticos.