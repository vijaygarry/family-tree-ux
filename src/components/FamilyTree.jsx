import { Tree, TreeNode } from "react-organizational-chart";
import { Link } from "react-router-dom";

const getImagePath = (url) => {
  if (!url) return "/sample-male2.jpeg";
  return `/${url}`;
};

const MemberCard = ({ member }) => {
  // determine bg color per member
  // determine bg color per member
    let bgColor = "#C0EDFF";
    if (member.belongsToSameFamily === false) {
      bgColor = "#ffffff";
    } else if (member.alive === false) {
      bgColor = "#AFAFAF";
    } else if (member.gender === "Male") {
      bgColor = "#C0EDFF";
    } else if (member.gender === "Female") {
      bgColor = "#FFC2E1";
    }

  return (
    <Link to={`/member/${member.memberId}`} className="text-decoration-none">
      <div
        className={`member-card d-flex align-items-center p-2 ${member.selectedNode ? "root-node" : ""}`}
        style={{
          minWidth: "180px",
          borderRadius: "8px",
          backgroundColor: bgColor,
        }}
      >
        {member.profileImageThumbnail && (
            <img
              src={getImagePath(member.profileImageThumbnail)}
              alt={`${member.firstName}`}
              className="mb-1"
              style={{
                width: "62px",
                height: "62px",
                borderRadius: "10%",
                objectFit: "cover",
                marginRight: "0px",
              }}
            />
          )}
          <div className="card-body p-2">
            <h6 className="card-title mb-1 fs-12">
              {member.firstName} {member.lastName}
            </h6>
            <p className="m-0 fs-10">{member.age}</p>
          </div>
      </div>
    </Link>
  );
};

// Combined card for a couple: renders as a single node with two halves.
const CoupleCard = ({ leftMember, rightMember }) => {
  const renderHalf = (member, side) => {
    if (!member) return null;

    // determine bg color per member
    let bgColor = "#C0EDFF";
    if (member.belongsToSameFamily === false) {
      bgColor = "#ffffff";
    } else if (member.alive === false) {
      bgColor = "#AFAFAF";
    } else if (member.gender === "Male") {
      bgColor = "#C0EDFF";
    } else if (member.gender === "Female") {
      bgColor = "#FFC2E1";
    }

    // rounded corners on left / right halves
    const borderRadius = side === "left" ? "8px 0 0 8px" : "0 8px 8px 0";

    return (
      <Link
        key={member.memberId}
        to={`/member/${member.memberId}`}
        className="text-decoration-none"
        style={{ flex: 1 }}
      >
        <div
          className={`member-card d-flex align-items-center p-2 ${member.selectedNode ? "root-node" : ""}`}
          style={{
            minWidth: "180px",
            borderRadius,
            backgroundColor: bgColor,
            height: "100%",
          }}
        >
          {member.profileImageThumbnail && (
            <img
              src={getImagePath(member.profileImageThumbnail)}
              alt={`${member.firstName}`}
              className="mb-1"
              style={{
                width: "62px",
                height: "62px",
                borderRadius: "10%",
                objectFit: "cover",
                marginRight: "0px",
              }}
            />
          )}
          <div className="card-body p-2">
            <h6 className="card-title mb-1 fs-12">
              {member.firstName} {member.lastName}
            </h6>
            <p className="m-0 fs-10">{member.age}</p>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div style={{ display: "flex", alignItems: "stretch", minWidth: 360 }}>
      {renderHalf(leftMember, "left")}
      {/* divider */}
      {rightMember && <div style={{ width: 1, background: "rgba(0,0,0,0.08)" }} aria-hidden="true" />}
      {rightMember && renderHalf(rightMember, "right")}
    </div>
  );
};

const CoupleNode = ({ node }) => (
  <div className="d-flex justify-content-center">
    {node.spouse ? (
      <CoupleCard leftMember={node.member} rightMember={node.spouse} />
    ) : (
      <MemberCard member={node.member} />
    )}
  </div>
);

const MemberNode = ({ node }) => (
  <TreeNode
    label={<CoupleNode node={node} />}
    className={node.member?.belongsToSameFamily === false ? "external-node" : ""}
  >
    {node.children &&
      node.children.map((child) => (
        <MemberNode key={child.member.memberId} node={child} />
      ))}
  </TreeNode>
);

const FamilyTree = ({ familyTreeRoot }) => {
  if (!familyTreeRoot) return null;
  return (
    <Tree
      lineWidth={"2px"}
      lineColor={"#ccc"}
      lineBorderRadius={"10px"}
      label={<CoupleNode node={familyTreeRoot} />}
    >
      {familyTreeRoot.children &&
        familyTreeRoot.children.map((child) => (
          <MemberNode key={child.member.memberId} node={child} />
        ))}
    </Tree>
  );
};

export default FamilyTree;
