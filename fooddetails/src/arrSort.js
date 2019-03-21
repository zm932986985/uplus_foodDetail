
export function compareUp(arr,num){
	function sortNumber(num)
	{
	return function(a,b){
		if(a[num] === b[num]) return a[num] - b[num];
		return a[num] - b[num]
	}
	}

	// document.write(arr + "<br />")
	return arr.sort(sortNumber(num)).reverse()
}


export function compareDown(arr,num){
	function sortNumber(num)
	{
	return function(a,b){
		if(a[num] === b[num]) return a[num] - b[num];
		return a[num] - b[num]
	}
	}

	// document.write(arr + "<br />")
	return arr.sort(sortNumber(num))
}