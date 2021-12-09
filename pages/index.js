import { useState, useEffect } from 'react';
import textdata from '../LocalData/data';
export default function Home() {
	// متغير لتخزين القطع النصيه
	const [data, setData] = useState('Hello1 Hello2');

	// مؤشر عام لمتابعه عدد المدخلات ومقارنتها بالحرف المقابل في القطعه النصيه
	const [charPointer, setCharPointer] = useState(0);

	// مؤشر لمتابعة الاحرف المدخله الصحيحه
	const [rightPointer, setRightPointer] = useState(0);

	// مصفوفه لجمع الحروف الخاطئه
	const [wrongPointer, setWrongPointer] = useState([]);

	const [wordPointer, setWordPointer] = useState(0);
	// متغير لتخزين الوقت
	const [time, setTime] = useState(0);

	// متغير لتحديد ما اذا كانت تم بدء الكتابه ام لا
	const [startText, setStartText] = useState(false);

	// متغير لبدء الوقت و الايقاف
	const [start, setStart] = useState(false);

	// متغير لتخزين قيمة معدل الكتابة في الدقيقة
	const [Wpm, setWpm] = useState(0);

	//  متغير لتحديد شكل واجة المسخدم
	const [step, setStep] = useState(1);

	// متغير لتحديد هل تم الانتهاء من الكتابه
	const [isFinish, setFinished] = useState(false);

	const [inputValue, setInputValue] = useState('');

	const [totalEvent, setTotalEvent] = useState('');

	// أختيار قطعه نصية عشاوئيا من الكائن
	var randomProperty = function () {
		var keys = Object.keys(textdata);
		setData(textdata[keys[(keys.length * Math.random()) << 0]]);
	};

	// يتم استدعاء الداله السابقه في كل مره يحدث تغير في المتغير داتا
	useEffect(() => {
		// randomProperty(textdata);
	}, [data]);

	// مؤقت يعمل في كل مره تتغير قيمة ستارت الى ترو
	useEffect(() => {
		let interval = null;
		if (start) {
			interval = setInterval(() => {
				setTime((prevTime) => prevTime + 10);
			}, 10);
		} else {
			clearInterval(interval);
		}
		return () => clearInterval(interval);
	}, [start]);

	// داله تسبقبل الحدث من الانبوت
	const onType = (e) => {
		setInputValue(e.target.value);
		if (e.nativeEvent.inputType !== 'deleteContentBackward') {
			setTotalEvent(totalEvent + e.target.value.slice(-1));
			setCharPointer(totalEvent.length + 1);
		}

		// إذا كان الحدث هو الاول يتم بدء الؤقت
		// في كل مره يتم كتابة حرف يزيد المشر العام ب1
		if (startText == false) {
			setStartText(true);
			setStart(true);
		}

		// في كل مره يكون الحرف المدخل مطابق لحرف المؤشر العام نزيد مؤشر الحروف الصحيحه ب1
		if (
			data.slice(0, charPointer + 1) ===
			totalEvent + e.target.value.slice(-1)
		) {
			console.log(totalEvent);
			setRightPointer(totalEvent.length + 1);
			if (e.target.value.slice(-1) === ' ') {
				setWordPointer(wordPointer + 1);
				setInputValue(' ');
			}
			// console.log(rightPointer + 1, data.length);
			if (rightPointer + 1 === data.length) {
				setStartText(false);
				setStart(false);
				WPM();
				setStep(3);
				setFinished(true);
			}
		} else if (e.nativeEvent.inputType !== 'deleteContentBackward') {
			setWrongPointer([...wrongPointer, data[charPointer]]);
		}
		console.log('e.length: ' + e.target.value.length);
	};
	// console.log(data.split(' ')[wordPointer]);
	console.log(
		'totalEvent: ' + totalEvent,
		'totalEventLength: ' + totalEvent.length,
		'dataSlice: ' + data.slice(0, charPointer),
		'dataRight: ' + data.slice(0, rightPointer),
		'currentWord: ' + data.split(' ')[wordPointer],
		'dataLenght: ' + data.slice(0, charPointer).length,
		'RP: ' + rightPointer,
		'CP: ' + charPointer
	);
	// داله تسبقبل الحدث من الانبوت
	const onDelete = (e) => {
		// اذا كان الحدث هو زر المسح يتم التحقق ان الانبوت غير فاضي
		if (e.key === 'Backspace' && e.target.value.length !== 0) {
			// في هذه الحاله ينقص المرؤشر العام ب1
			setTotalEvent(totalEvent.slice(0, -1));
			setCharPointer(totalEvent.length - 1);
			// في حاله انه المؤشر العام و مؤشر الحروف الصحيحه متساويان يتم تنقيص مؤشر الحروف الصحيحه ايضا
			if (charPointer == rightPointer) {
				setRightPointer(rightPointer - 1);
			}
		}
	};

	// تم استعمال المعادلة التاليه من الموقع التالي
	// https://www.speedtypingonline.com/typing-equations
	const WPM = () => {
		var wpm = 0;
		var sec = Math.floor((time / 1000) % 60);
		var min = Math.floor((time / 60000) % 60);
		var now = (min * 60 + sec) / 60;
		wpm = data.length / 5;
		wpm = wpm / now;
		setWpm(Math.round(wpm));
	};

	return (
		<div className="flex flex-col items-center h-screen py-2 bg-gray-100">
			<main className="h-full items-center justify-center w-full text-center flex flex-col ">
				<span className="p-4 text-6xl font-bold font-houseslant text-gray-700">
					Speed Type
				</span>
				<div className="flex flex-col justify-center items-center max-w-screen-lg h-full space-y-20 p-x-4">
					{step == 0 ? (
						<>
							<span className="text-left text-2xl font-bold text-gray-600 font-inter">
								Start Tisting you’r self and improve you’r typing skils.
							</span>
							<button
								className="block uppercase mx-auto shadow bg-red-400  focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded font-inter"
								onClick={() => setStep(1)}
							>
								Start
							</button>
						</>
					) : (
						<>
							<span className="text-left text-2xl font-bold text-gray-600 font-inter">
								{data.split('').map((i, x) => {
									if (x < charPointer) {
										if (x < rightPointer) {
											return (
												<span className="text-gr een-400 bg-gray-200 border-b-2 border-green-400">
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
							{!isFinish ? (
								<div className="w-full ">
									<input
										value={inputValue}
										placeholder="Go"
										onChange={onType}
										ref={(input) => input && input.focus()}
										onKeyDown={onDelete}
										className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 w-full"
									/>
								</div>
							) : (
								<div className="flex flex-col space-y-20">
									<div className="flex flex-row space-x-20">
										<span className="text-left text-2xl font-bold text-gray-600 font-inter">
											You'r WPM: {Wpm}
										</span>
										<span className="text-left text-2xl font-bold text-gray-600 font-inter">
											Time: {Math.floor((time / 60000) % 60)}:
											{Math.floor((time / 1000) % 60)}
										</span>
									</div>
									<div className="flex flex-row  mx-auto">
										<button
											className="block uppercase  shadow bg-red-400 font-inter  focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded-tl rounded-bl font-bold"
											onClick={() => {
												setTime(0);
												setWpm(0);
												setCharPointer(0);
												setRightPointer(0);
												setStep(1);
												wordPointer(0);
												wrongPointer(0);
												setFinished(false);
											}}
										>
											Repeat
										</button>
										<button
											className="block uppercase  shadow bg-green-400 font-inter  focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded-tr rounded-br font-bold"
											onClick={() => {
												setTime(0);
												setWpm(0);
												setCharPointer(0);
												setRightPointer(0);
												setStep(1);
												wordPointer(0);
												wrongPointer(0);
												setFinished(false);
												setData('');
											}}
										>
											New
										</button>
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</main>
		</div>
	);
}

{
	/* <div className="text-left text-2xl font-bold text-gray-400 font-inter"> */
}
{
	/* <span>
									{('0' + Math.floor((time / 60000) % 60)).slice(-2)}:
								</span>
								<span>{('0' + Math.floor((time / 1000) % 60)).slice(-2)}</span>
							</div> */
}
