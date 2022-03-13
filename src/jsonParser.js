



function JsonDataDisplay() {
    const JsonData = fetch('/get_comments').then(response => response.json()).then(data => { JSON.parse(data) });
    const Parse = JsonData.map(
        (info) => {
            return (
                <tr>
                    <td>{info.rating}</td>
                    <td>{info.comment}</td>
                </tr>
            )
        }
    )
    return (
        <div>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Rating</th>
                        <th>Comment</th>
                    </tr>
                </thead>
                <tbody>


                    {DisplayData}

                </tbody>
            </table>

        </div>
    )
}

export default JsonDataDisplay;
