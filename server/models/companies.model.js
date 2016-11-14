const Company = require('../db').Company
const BrandName = require('../db').BrandName
const Option = require('../db').Option
const companiesModel = {}

/*            OPTIONS             */
companiesModel.getalloptions = () => {
  return Option.findAll()
}

companiesModel.postoneoption = (option) => {
  return Option.findOrCreate({
    where: {
      service: option.service
    },
    defaults: {
      duration: option.duration,
      service: option.service,
      description: option.description,
      companyId: option.companyId
    }
  })
  .spread((newOption, created) => {
    if (created) {
      return {
        success: true,
        message: 'Option Created : ' + option.name
      }
    }
    return {
      success: false,
      message: 'Option ' + option.name + ' Already Exists, please make a new Option'
    }
  })
}

companiesModel.updateoption = option => {
  return Option.update({
    duration: option.duration,
    service: option.service,
    description: option.description,
    companyId: option.companyId,
    id: option.id
  },
    {
      where: {
        id: option.id
      }
    })
}

companiesModel.deleteoption = option => {
  return Option.destroy({
    where: {
      id: option.id
    }
  })
}

/*            OPTIONS END             */

/*            BRAND NAMES             */
companiesModel.getallbrandnames = () => {
  return BrandName.findAll()
}

//SEARCH BRAND NAME BY ID or STRING, NOT FULL STRING
companiesModel.getbrandname = brand => {
  console.log(brand, '***brand')
  if (Number(brand.val)) {
    return BrandName.findOne({
      where: {id: brand.val},
      include: [{model: Company}]
    })
  } else {
    return BrandName.findAll({
      where: {name: {$ilike: '%' + brand.val + '%'}}
    })
  }
}

companiesModel.postbrandname = brandName => {
  return BrandName.findOrCreate({
    where: {
      $or: [
        { name: brandName.name },
        { id: brandName.id }
      ]
    },
    defaults: {
      name: brandName.name,
      companyId: brandName.companyId
    }
  })
  .spread((newBrandName, created) => {
    if (created) {
      return {
        success: true,
        message: 'Brand Name Created'
      }
    }
    return {
      success: false,
      message: 'Brand Name Already Exists, please make a new Brand Name'
    }
  })
}
/*            BRAND NAMES END             */

/*            COMPANY             */
companiesModel.getonecompany = data => {
  console.log('MODEL getonecompany:', data)
  return Company.find({
    where: {id: data.id},
    include: [ {model: BrandName} ]
  })
}

companiesModel.getallcompanies = () => {
  return Company.findAll()
}

companiesModel.postcompany = data => {
  console.log('MODEL postcompany:', data)
  return Company.findOrCreate({
    where: {
      name: data.name
    },
    defaults: {
      name: data.name,
      address: data.address,
      phoneNumber: data.phoneNumber,
      description: data.description,
      website: data.website,
      image: data.image,
      logo: data.logo,
      BrandNameId: data.brandNameId
    }
  })
  .spread((newComapny, created) => {
    if (created) {
      return {
        success: true,
        message: 'new company created'
      }
    }
    return {
      success: false,
      message: 'company already exists'
    }
  })
}

companiesModel.deletecompany = data => {
  console.log('MODEL deletecompany:', data)
  return Company.destroy({
    where: {
      id: data.id
    }
  })
}

//should be given all values to change
companiesModel.updatecompany = data => {
  console.log('MODEL updatecompany:', data)
  return Company.update({
    name: data.name,
    address: data.address,
    phoneNumber: data.phoneNumber,
    description: data.description,
    website: data.website,
    image: data.image,
    logo: data.logo,
    BrandNameId: data.BrandNameId
  },
    {
      where: {id: data.id}
    })
}

/*            COMPANY END             */
module.exports = companiesModel
