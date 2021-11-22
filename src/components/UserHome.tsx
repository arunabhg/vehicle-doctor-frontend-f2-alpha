import React from 'react';
import CustomerNav from './elements/CustomerNav';

function UserHome() {
    return (
        <div className="userHomeDiv App">
            <table>
                <tr>
                    <td>
                        <CustomerNav/>
                    </td>
                </tr>
            </table>
        </div>
    );
}

export default UserHome;