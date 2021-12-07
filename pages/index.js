import { useState, useEffect } from 'react';
import textdata from '../LocalData/data';
export default function Home() {
	const [data, setData] = useState('');
	const [textValue, setTextValue] = useState();
	const [charPointer, setCharPointer] = useState(0);
	const [rightPointer, setRightPointer] = useState(0);
	const [wrongFlag, setWrongFlag] = useState(false);

	var randomProperty = function () {
		var keys = Object.keys(textdata);
		setData(textdata[keys[(keys.length * Math.random()) << 0]]);
	};

	useEffect(() => {
		randomProperty(textdata);
	}, []);

	const onType = (e) => {
		setCharPointer(e.target.value.length);
		if (data.slice(0, charPointer + 1) === e.target.value) {
			setRightPointer(e.target.value.length);
		}
		setTextValue(e.target.value);
		console.log(data.slice(0, charPointer + 1), e.target.value);
	};

	return (
		<div className="flex flex-col items-center h-screen py-2 bg-gray-100">
			<main className="h-full items-center justify-center w-full text-center flex flex-col ">
				<span className="p-4 text-6xl font-bold font-houseslant text-gray-700">
					Speed Type
				</span>
				<div className="flex flex-col justify-center items-center max-w-screen-lg h-full space-y-20">
					<span className="text-left text-2xl font-bold text-gray-600 font-inter">
						{data.split('').map((i, x) => {
							if (x < charPointer) {
								if (x < rightPointer) {
									return (
										<span className="text-green-400 bg-gray-200 border-b-2 border-green-400">
											{i}
										</span>
									);
								} else {
									return (
										<span className="text-red-400 bg-gray-200 border-b-2 border-red-400">
											{i}
										</span>
									);
								}
							} else {
								return <span>{i}</span>;
							}
						})}
					</span>

					<div className="w-full ">
						<input
							placeholder="Go"
							onChange={onType}
							className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 w-full"
						/>
					</div>
				</div>
			</main>
		</div>
	);
}
