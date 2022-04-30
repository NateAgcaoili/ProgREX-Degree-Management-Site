import React, { useState, useEffect } from "react";
import axios from "axios";

//Fetching signer details from backend
function AdminDocSignedTable(props) {
	var signerIndex = 0;

	const [signerList, setSignerList] = useState([]);
	const [signerName, setSignerName] = useState();

	//Getting signed list data
	const getSignerList = async () => {
		try {
			const response = await axios.get(`/document/detail/${props.docId}`);
			const jsonData = await response.data;

			console.log(jsonData.usersSigned);

			setSignerList(...signerList, jsonData.usersSigned);
		} catch (err) {
			console.error(err.message);
		}
	};

	useEffect(() => {
		getSignerList();
	}, []);

	//Signer name compoonent dynamically
	function SignerName(props) {
		const getSignerData = async () => {
			try {
				let response = await axios.get(`/user/detail/${props.userId}`);
				const jsonData = await response.data;

				setSignerName(jsonData.fName + " " + jsonData.lName);
			} catch (err) {
				console.error(err.message);
			}
		};

		useEffect(() => {
			getSignerData();
		}, []);

		return <p>{signerName}</p>;
	}

	let signerRows = signerList.map((signer) => {
		var rowColor;

		if (signerIndex++ % 2 == 0) {
			rowColor = "dark:bg-stone-700";
		} else {
			rowColor = "dark:bg-stone-600";
		}

		return (
			<tr className={`bg-white ${rowColor} `} key={props.docId}>
				<th
					scope="row"
					className="px-2 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
				>
					<SignerName userId={signer.signerId} />
				</th>
				<td
					className="px-2 py-4"
					data-bs-toggle="modal"
					data-bs-target={`#signedListModal${props.docId}`}
				>
					{new Date(signer.dateSigned).toLocaleDateString()}
				</td>
			</tr>
		);
	});

	return (
		<div className="relative  shadow-md sm:rounded-lg h-full overflow-visible">
			<table className="w-full text-sm text-left text-gray-500 dark:text-gray-50">
				<thead className="text-xs text-white-700 uppercase bg-white-50 dark:bg-white-700 dark:text-white-400 dark:bg-stone-900">
					<tr>
						<th scope="col" className="px-2 py-4">
							Student Name
						</th>
						<th scope="col" className="px-2 py-4">
							Date Signed
						</th>
					</tr>
				</thead>
				<tbody>{signerRows}</tbody>
			</table>
		</div>
	);
}

export default AdminDocSignedTable;