export class CreateUserDto {
    constructor(user) {
        this.FullName = `${user.first_name} ${user.last_name}`;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.age = user.age;
        this.role = user.role;
        this.email = user.email;
        this.password = user.password;
        this.id = user._id;
        this.cart = user.cart;
    }
}

export class GetUserDto {
    constructor(userDao) {
        this.first_name = userDao.first_name;
        this.last_name = userDao.last_name;
        this.fullName = userDao.FullName;
        this.age = userDao.age;
        this.role = userDao.role;
        this.cart = userDao.cart;
    }
}