const base_url = import.meta.env.VITE_API_BASE_URL;


const listByInstructor = async (params, credentials, signal) => {
    try {
        let response = await fetch(base_url + '/course/api/courses/by/' + params.userId, {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })
        return response.json();
    } catch (err) {
        console.log(err)
    }
}


const create = async (params,credentials,courseData) => {
    try {
        let response = await fetch(base_url + "/course/api/courses/by/" + params.userId, {
            method: 'POST',
            headers: {
                'Accept': 'multipart/form-data',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: courseData
        });
        response = await response.json();
        return response;
    } catch (err) {
        console.log(err);
    }
}

const read = async (params, signal) => {
    try {
        let response = await fetch(base_url+'/course/api/course/' + params.courseId, {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

const update = async (params, credentials, course) => {
    try {
        let response = await fetch(base_url + '/course/api/course/' + params.courseId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: course
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

const remove = async (params, credentials) => {
    try {
        let response = await fetch(base_url+'/course/api/course/' + params.courseId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })
        response = await response.json();
        return response;
    } catch (err) {
        console.log(err)
    }
}

const newLesson = async (params, credentials, object)=>{
    try {
        let response = await fetch(base_url + '/course/api/courses/' + params.courseId + '/lesson/new', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify(object)
        });
        response = await response.json();
        return response;
    } catch (err) {
        console.log(err);
    }
}

const listPublished = async (signal) => {
    try {
        let response = await fetch(base_url + '/course/api/courses/published', {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json'
            }
        });
        response = await response.json();
        return response;
    } catch (err) {
        console.log(err);
    }
}
export { listByInstructor, create, read, update, remove, newLesson, listPublished };