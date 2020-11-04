import Axios from 'axios'

// 获取所有班主任和分页
export const getHeadAll = (page, pageSize) => {
  return Axios.post('http://132.232.89.22:8080/headTeacherPage', {
    page: page,
    pageSize: pageSize
  })
}

// 添加一名班主任
export const addHead = (person) => {
  return Axios.post('http://132.232.89.22:8080/addHeadTeacher', {
    ...person
  })
}

// 修改班主任信息
export const updateHead = (id, name) => {
  return Axios.post('http://132.232.89.22:8080/updateHeadTeacher', {
    _id: id,
    headname: name
  })
}

// 删除一名班主任
export const deleteHead = (id) => {
  return Axios.post('http://132.232.89.22:8080/delHeadTeacher', {
    _id: id
  })
}

// 获取所有讲师和分页
export const getTeacherAll = (page, pageSize) => {
  return Axios.post('http://132.232.89.22:8080/lecturerPage', {
    page: page,
    pageSize: pageSize
  })
}

// 添加一名讲师
export const addTeacher = (person) => {
  return Axios.post('http://132.232.89.22:8080/addLecturer', {
    ...person
  })
}

// 修改讲师信息
export const updateTeacher = (id, name) => {
  return Axios.post('http://132.232.89.22:8080/updateLecturer', {
    _id: id,
    lecturername: name
  })
}

// 删除一名讲师
export const deleteTeacher = (id) => {
  return Axios.post('http://132.232.89.22:8080/delLecturer', {
    _id: id
  })
}

// 获取所有市场部
export const getMarketAll = () => {
  return Axios.get('http://132.232.89.22:8080/getMarket')
}

// 添加市场部
export const addMarket = (market) => {
  return Axios.post('http://132.232.89.22:8080/addMarket', {
    marketname: market
  })
}

// 删除市场部
export const deleteMarket = (delMarkets) => {
  return Axios.post('http://132.232.89.22:8080/delMarket', {
    _id: delMarkets
  })
}

// 获取专业
export const getMajor = () => {
  return Axios.get('http://132.232.89.22:8080/getMajor')
}

// 添加专业
export const addMajor = (major) => {
  return Axios.post('http://132.232.89.22:8080/addMajor', {
    majorname: major
  })
}
