import os
import subprocess

def listar_usuarios():
    print("\nUsuarios en el sistema:")
    subprocess.run(['cut', '-d:', '-f1', '/etc/passwd'])

def listar_grupos():
    print("\nGrupos en el sistema:")
    subprocess.run(['cut', '-d:', '-f1', '/etc/group'])

def crear_usuario(nombre):
    subprocess.run(['sudo', 'useradd', '-m', nombre])
    print(f"Usuario '{nombre}' creado.")
    print("Asignar contraseña:")
    subprocess.run(['sudo', 'passwd', nombre])

def eliminar_usuario(nombre):
    subprocess.run(['sudo', 'userdel', '-r', nombre])
    print(f"Usuario '{nombre}' eliminado.")

def agregar_a_grupo(usuario, grupo):
    subprocess.run(['sudo', 'usermod', '-aG', grupo, usuario])
    print(f"Usuario '{usuario}' agregado al grupo '{grupo}'.")

def quitar_de_grupo(usuario, grupo):
    subprocess.run(['sudo', 'gpasswd', '-d', usuario, grupo])
    print(f"Usuario '{usuario}' quitado del grupo '{grupo}'.")

def cambiar_propietario(ruta, usuario):
    subprocess.run(['sudo', 'chown', usuario, ruta])
    print(f"El propietario de '{ruta}' ahora es '{usuario}'.")

def cambiar_grupo(ruta, grupo):
    subprocess.run(['sudo', 'chgrp', grupo, ruta])
    print(f"El grupo de '{ruta}' ahora es '{grupo}'.")

def cambiar_permisos(ruta, permisos):
    subprocess.run(['sudo', 'chmod', permisos, ruta])
    print(f"Permisos de '{ruta}' cambiados a '{permisos}'.")

def ver_permisos(ruta):
    print(f"\nPermisos de '{ruta}':")
    subprocess.run(['ls', '-l', ruta])

def ver_info_usuario(nombre):
    print(f"\nInformación del usuario '{nombre}':")
    subprocess.run(['id', nombre])
    print("\nConfiguración de contraseña:")
    subprocess.run(['chage', '-l', nombre])

def menu():
    while True:
        os.system('clear')  # Usa 'cls' en Windows si hace falta
        print("Gestor de Usuarios Linux")
        print("1. Listar usuarios")
        print("2. Listar grupos")
        print("3. Crear usuario con contraseña")
        print("4. Eliminar usuario")
        print("5. Agregar usuario a grupo")
        print("6. Quitar usuario de grupo")
        print("7. Cambiar propietario de un archivo")
        print("8. Cambiar grupo de un archivo")
        print("9. Cambiar permisos de un archivo")
        print("10. Ver permisos de un archivo")
        print("11. Ver información de un usuario")
        print("0. Salir")
        opcion = input("Elige una opción: ")

        if opcion == '1':
            listar_usuarios()
        elif opcion == '2':
            listar_grupos()
        elif opcion == '3':
            nombre = input("Nombre del usuario a crear: ")
            crear_usuario(nombre)
        elif opcion == '4':
            nombre = input("Nombre del usuario a eliminar: ")
            eliminar_usuario(nombre)
        elif opcion == '5':
            usuario = input("Nombre del usuario: ")
            grupo = input("Nombre del grupo: ")
            agregar_a_grupo(usuario, grupo)
        elif opcion == '6':
            usuario = input("Nombre del usuario: ")
            grupo = input("Nombre del grupo: ")
            quitar_de_grupo(usuario, grupo)
        elif opcion == '7':
            ruta = input("Ruta del archivo o carpeta: ")
            usuario = input("Nuevo propietario: ")
            cambiar_propietario(ruta, usuario)
        elif opcion == '8':
            ruta = input("Ruta del archivo o carpeta: ")
            grupo = input("Nuevo grupo: ")
            cambiar_grupo(ruta, grupo)
        elif opcion == '9':
            ruta = input("Ruta del archivo o carpeta: ")
            permisos = input("Permisos (ej: 755): ")
            cambiar_permisos(ruta, permisos)
        elif opcion == '10':
            ruta = input("Ruta del archivo o carpeta: ")
            ver_permisos(ruta)
        elif opcion == '11':
            nombre = input("Nombre del usuario: ")
            ver_info_usuario(nombre)
        elif opcion == '0':
            print("Saliendo...")
            break
        else:
            print("Opción inválida.")
        
        input("\nPresiona Enter para continuar...")

if __name__ == '__main__':
    menu()
