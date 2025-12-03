import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, loginUserDto } from './dto/index';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { RawHeaders, GetUser, Auth } from './decorators';
import { UserRoleGuard } from './guard/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: loginUserDto) {
    return this.authService.login(loginUserDto);
  }

  //! TODO: Este es para ver como obtener informacion de la request
  // *utiliza decoradores personalizados para acceder a información del usuario autenticado

  @Get('private')
  @UseGuards(AuthGuard()) //AuthGuard es para usar las estrategias, al no tener argumento usa por defecto que registraste
  testinPrivateRoute(
    //@Req() request: Express.Request,
    @GetUser() user: User, //extraer información de la request de forma limpia.
    @GetUser('email') userEmail: string, // extraer información de la request de forma limpia.
    @RawHeaders() rawHeaders: string[], //extraer información de la request de forma limpia.
  ) {
    return {
      ok: true,
      message: 'hola mundo privado',
      user,
      userEmail,
      rawHeaders,
    };
  }

  //! TODO: FORMA 1 DE VALIDAR LOS ROLES

  //@SetMetadata('roles', ['admin'])
  //*FORMA 1 DE VALIDAR: menos comun (casi no se usa)
  @Get('private2')
  @RoleProtected(ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testinPrivateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  //! TODO: FORMA 2 DE VALIDAR LOS ROLES, MAS SENCILLA
  //*FORMA 2 DE VALIDAR: mas comun, el auth hace todo lo de la forma 1, si no se pone nada dentro del auth es como si fuera ruta desprotegida
  //* para validar solo es poner el rol dentro del auth
  @Get('private3')
  @Auth(ValidRoles.admin)
  testinPrivateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}

//TODO: AuthGuard es quien se encarga de validar el token, pero lo hace delegando esa validación a la estrategia que configure
