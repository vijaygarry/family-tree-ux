import { getFormattedPhoneDisplay } from "../utils/phoneUtils";
import { Link } from "react-router-dom";
import { formatISODateToddMMMyyyy } from "../utils/formatUtils";

export const MemberListTable = ({ membersList, familyNameInHindi }) => {
  if (!membersList) return null;

  return (
    <div className="mb-4 mt-5">
      <h5 className="mb-4">Family Members </h5>
      <div className="table-responsive">
        <table className="table table-bordered table-striped family-members">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Relationship</th>
              <th>Birth Date</th>
              <th>Marital Status</th>
              <th>Phone</th>
              <th>Education</th>
              <th>Occupation</th>
            </tr>
          </thead>
          <tbody>
            {membersList.map((member) => (
              <tr key={member.memberId}>
                <td data-label="Name">
                  <Link
                    to={`/member/${member.memberId}`}
                    className="text-decoration-none"
                  >
                    {member.firstName} {member.lastName} <br />
                    {member.firstNameInHindi && `${member.firstNameInHindi}`}
                    {familyNameInHindi && ` ${familyNameInHindi}`}
                  </Link>
                </td>
                <td data-label="Relationship">{member.familyRelationship}</td>
                <td data-label="Birth Date">
                  {member.birthDate} <br />
                  {member.age}
                </td>
                <td data-label="Marital Status">
                  {member.maritalStatus} <br />
                  {member.weddingDate && formatISODateToddMMMyyyy(member.weddingDate)}
                </td>
                <td data-label="Phone">
                  {getFormattedPhoneDisplay(
                    member.phone,
                    member.phoneWhatsappRegistered
                  )}
                </td>
                <td data-label="Education">{member.educationDetails}</td>
                <td data-label="Occupation">{member.occupation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const RelationshipTable = ({ membersList, relationshipHeading }) => {
  if (!membersList) return null;

  return (
    <div className="mb-4 mt-0">
      <h5>{ relationshipHeading } </h5>
      <div className="table-responsive">
        <table className="table table-bordered table-striped family-members">
          <thead className="table-light">
            <tr>
              <th width="50%">Name</th>
              <th>Relationship</th>
            </tr>
          </thead>
          <tbody>
            {membersList.map((member) => (
              <tr key={member.memberId}>
                <td data-label="Name">
                  <Link
                    to={`/member/${member.memberId}`}
                    className="text-decoration-none"
                  >
                    {member.firstName} {member.lastName} <br />
                    {member.firstNameInHindi && `${member.firstNameInHindi}`}
                    {/* {familyNameInHindi && ` ${familyNameInHindi}`} */}
                  </Link>
                </td>
                <td data-label="Relationship">{member.familyRelationship}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const SpouseTable = ({ spouse }) => {
  if (!spouse) return null;

  return (
    <div className="mb-4 mt-0">
      <h5> Spouse </h5>
      <div className="table-responsive">
        <table className="table table-bordered table-striped family-members">
          <thead className="table-light">
            <tr>
              <th width="50%">Name</th>
              <th>Relationship</th>
            </tr>
          </thead>
          <tbody>
            
              <tr key={spouse.memberId}>
                <td data-label="Name">
                  <Link
                    to={`/member/${spouse.memberId}`}
                    className="text-decoration-none"
                  >
                    {spouse.firstName} {spouse.lastName} <br />
                    {spouse.firstNameInHindi && `${spouse.firstNameInHindi}`}
                    {/* {familyNameInHindi && ` ${familyNameInHindi}`} */}
                  </Link>
                </td>
                <td data-label="Relationship">{spouse.familyRelationship}</td>
              </tr>
            
          </tbody>
        </table>
      </div>
    </div>
  );
};
