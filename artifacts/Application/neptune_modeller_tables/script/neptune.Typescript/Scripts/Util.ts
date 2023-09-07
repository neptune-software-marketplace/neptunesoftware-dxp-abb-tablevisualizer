namespace Util {
    const isObject = (object) => {
        return object != null && typeof object === "object";
    };

    export function areSameObjects(object1, object2, ignoreNameAndId = false) {
        let objKeys1 = Object.keys(object1);
        let objKeys2 = Object.keys(object2);
        
        if (ignoreNameAndId) {
            objKeys1 = objKeys1.filter((key) => key !== "id" && key !== "name");
            objKeys2 = objKeys2.filter((key) => key !== "id" && key !== "name");
        }

        if (objKeys1.length !== objKeys2.length) return false;

        for (var key of objKeys1) {
            const value1 = object1[key];
            const value2 = object2[key];

            const areObjects = isObject(value1) && isObject(value2);

            if (
                (areObjects && !areSameObjects(value1, value2, true)) ||
                (!areObjects && value1 !== value2)
            ) {
                return false;
            }
        }
        return true;
    }

    export function areSameArrays(array1, array2) {
        if (array1.length !== array2.length) return false;

        const sortedArray1 = array1.sort((a,b) => a.id - b.id)
        const sortedArray2 = array2.sort((a,b) => a.id - b.id)

        return sortedArray1.every((object1, index) => {
            const object2 = sortedArray2[index];
            return areSameObjects(object1, object2)
        })
    }
}
