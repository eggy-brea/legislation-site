const defaultStatutes = [
    {
        id: "ukpga-1988-52",
        code: "ukpga/1988/52",
        title: "Road Traffic Act 1988",
        category: "Primary",
        section: "Section 3 - Careless, and Inconsiderate, Driving",
        content: "If a person drives a mechanically propelled vehicle on a road or other public place without due care and attention, or without reasonable consideration for other persons using the road, he is guilty of an offence.",
        year: 1988
    },
    {
        id: "ukpga-1984-27",
        code: "ukpga/1984/27",
        title: "Road Traffic Regulation Act 1984",
        category: "Primary",
        section: "Section 14 - Temporary Prohibition or Restriction on Roads",
        content: "If the traffic authority for a road are satisfied that traffic on the road should be restricted or prohibited because works are being executed or proposed to be executed on or near the road, the authority may by order restrict or prohibit the use of that road.",
        year: 1984
    },
    {
        id: "uksi-2016-362",
        code: "uksi/2016/362",
        title: "The Traffic Signs Regulations and General Directions 2016",
        category: "Secondary",
        section: "Regulation 10 - Compliance with Traffic Signs and Signals",
        content: "Subject to regulation 11, a vehicle proceeding past a light signal or matrix sign displaying an aspect or legend specified under these Regulations must comply with the restriction or hazard indication conveyed.",
        year: 2016
    }
];
function getStatutes() {
    const data = localStorage.getItem('legislation_replica_db');
    return data ? JSON.parse(data) : defaultStatutes;
}
function saveStatutes(statutes) {
    localStorage.setItem('legislation_replica_db', JSON.stringify(statutes));
}
