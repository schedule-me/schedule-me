const User = require('../db').User
const Company = require('../db').Company
const UserCompany = require('../db').UserCompany

const usersModel = {}

usersModel.getAllEmployeesCompanyId = companyId => {
  return Company.findAll({
    include: {model: User},
    where: {id: companyId.companyId}
  })
}

usersModel.signin = (email, password) => {
  return User.findOne({
    where: {
      email: email
    }
  })
  .then((user) => {
    if (user) {
      if (user.checkPassword(password)) {
        return UserCompany.findAll({
          where: {
            userId: user.id
          }
        })
        .then((associations) => {
          return {
            'success': true,
            'message': 'correct password',
            'userId': user.id,
            'associations': associations
          }
        })
        .catch((err) => {
          return {
            'success': false,
            'message': `error retrieving associations for user: ${err}`
          }
        })
      } else {
        return {
          'success': false,
          'message': 'incorrect password'
        }
      }
    } else {
      return {
        'success': false,
        'message': 'user not found'
      }
    }
  })
  .catch((err) => {
    return {
      'success': false,
      'message': err
    }
  })
}

usersModel.signup = (user) => {
  return User.findOrCreate({
    where: {
      email: user.email
    },
    defaults: {
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      phoneNumber: user.phoneNumber,
      image: user.image
    }
  })
  .spread((newUser, created) => {
    if (created) {
      return {
        'success': true,
        'message': 'new user created',
        'userId': newUser.id
      }
    }
    return {
      'success': false,
      'message': 'user already exists'
    }
  })
}

usersModel.getEmployeesByCompany = (companyId) => {
  return Company.findById(companyId)
    .then((company) => {
      if (!company) {
        return {
          'success': false,
          'message': 'company not found'
        }
      }
      return company.getUsers({
        attributes: {
          exclude: ['password']
        }
      })
      .then((users) => {
        return {
          'success': true,
          'message': 'employees found',
          'employees': users
        }
      })
      .catch((err) => {
        return {
          'success': false,
          'message': err
        }
      })
    })
    .catch((err) => {
      return {
        'success': false,
        'message': err
      }
    })
}

usersModel.addUserToCompany = function (userId, companyId, isAdmin, getUserAssociations) {
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return {
          'success': false,
          'message': 'user not found'
        }
      }
      // check if user already connected to company
      return user.getCompanies({
        where: {
          id: companyId
        }
      })
      .then((companies) => {
        if (companies.length) {
          return {
            'success': false,
            'message': 'relation between user and company already exists'
          }
        }
        // add user to company
        return Company.findById(companyId)
          .then((company) => {
            if (!company) {
              return {
                'success': false,
                'message': 'company not found'
              }
            }
            return user.addCompany(company, { admin: isAdmin })
              .then((result) => {
                if (getUserAssociations) {
                  return UserCompany.findAll({
                    where: {
                      userId: user.id
                    }
                  })
                  .then((associations) => {
                    return {
                      'success': true,
                      'message': 'user added to company',
                      'associations': associations
                    }
                  })
                } else {
                  return {
                    'success': true,
                    'message': 'user added to company'
                  }
                }
              })
              .catch((err) => {
                return {
                  'success': false,
                  'message': err
                }
              })
          })
          .catch((err) => {
            return {
              'success': false,
              'message': err
            }
          })
      })
    })
}

usersModel.removeUserFromCompany = (userId, companyId) => {
  return Company.findById(companyId)
    .then((company) => {
      if (!company) {
        return {
          'success': false,
          'message': 'company not found'
        }
      }
      return User.findById(userId)
        .then((user) => {
          if (!user) {
            return {
              'success': false,
              'message': 'user not found'
            }
          }
          return company.removeUser(user)
            .then(() => {
              return {
                'success': true,
                'message': 'user removed'
              }
            })
            .catch((err) => {
              return {
                'success': false,
                'message': err
              }
            })
        })
    })
}

usersModel.updateUserInfo = (userId, userData) => {
  let updateFields = Object.keys(userData)

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return {
          'success': false,
          'message': 'user not found'
        }
      }
      // user must input correct password to update info
      if (user.checkPassword(userData.password)) {
        return user.update(userData, {
          fields: updateFields
        })
          .then((updatedUser) => {
            return {
              'success': true,
              'message': 'user info updated'
            }
          })
          .catch((err) => {
            return {
              'success': false,
              'message': err
            }
          })
      } else {
        // incorrect password
        return {
          'success': false,
          'message': 'incorrect password'
        }
      }
    })
    .catch((err) => {
      return {
        'success': false,
        'message': err
      }
    })
}

usersModel.getUserDetails = (userId, email) => {
  return User.findOne({
    where: {
      $or: [
        {id: userId},
        {email: email}
      ]
    },
    attributes: { exclude: ['password'] }
  })
  .then((user) => {
    if (!user) {
      return {
        'success': false,
        'message': 'user not found'
      }
    }
    return {
      'success': true,
      'message': 'user found',
      'user': user
    }
  })
  .catch((err) => {
    return {
      'success': false,
      'message': err
    }
  })
}

module.exports = usersModel
