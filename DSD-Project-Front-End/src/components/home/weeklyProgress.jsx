import React, {useEffect, useState} from "react";
import axios from "axios";
import { serverUrl } from '../../apis/serverUrl';

export default function WeeklyProgress({userId}) {
    const [weeklyProgress, setWeeklyProgress] = useState(0);

    useEffect(() => {
        axios.get(serverUrl+
            "/getNumberOfSubmittedThisWeek?user_id=" + userId
        ).then((response) => {
            setWeeklyProgress(Math.floor(response.data / 7 * 100));
            console.log(userId)
        })
    }, [userId]);

    return (
        <div className="card-block" style={{ padding: "22px" }}>
            <div className="row d-flex align-items-center">
                <div className="col-9">
                    <h5 className="card-header">
                        Week Progress
                    </h5>
                </div>

                <div className="col-3 text-right">
                    <p className="m-b-0">
                        {weeklyProgress} %
                    </p>
                </div>
            </div>
            <div className="progress m-t-30" style={{ height: "7px" }}>
                <div
                    className="progress-bar progress-c-theme"
                    role="progressbar"
                    style={{
                        width: weeklyProgress + "%",
                        ariavaluenow: "50",
                        ariavaluemin: "0",
                        ariavaluemax: "100",
                    }}
                />
            </div>
        </div>
    )

}