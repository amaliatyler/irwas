const clearState = (stateObj) => {
    for(const key in stateObj) {
        delete stateObj[key];
    }

    return stateObj;
}

export default clearState;