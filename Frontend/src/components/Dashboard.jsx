import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrganizations, getAllUsers, getOrgUsers } from '../services/api'; // Import new API
import { Card, Row, Col, Button } from 'react-bootstrap';
import Breadcrumbs from '../components/Breadcrumbs';
import Loader from '../components/Loader';
import { Building, Users, UsersRound } from 'lucide-react'; // Added icons
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// A new component for a single stat card
function StatCard({ title, value, icon, color }) {
    return (
        <Card className="shadow-sm border-0">
            <Card.Body>
                <div className="d-flex align-items-center">
                    <div className={`rounded-circle d-flex align-items-center justify-content-center me-3`} style={{ width: '48px', height: '48px', backgroundColor: `rgba(${color}, 0.1)` }}>
                        {icon}
                    </div>
                    <div>
                        <h4 className="h2 mb-0 fw-bold">{value}</h4>
                        <span className="text-muted">{title}</span>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}

export default function Dashboard() {
    const [stats, setStats] = useState({ totalOrgs: 0, totalUsers: 0, avgUsers: 0 });
    const [orgs, setOrgs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch all data in parallel
                const [orgResponse, userResponse] = await Promise.all([
                    getOrganizations(),
                    getAllUsers()
                ]);

                const orgData = orgResponse.data;
                const userData = userResponse.data;

                const totalOrgs = orgData.length;
                const totalUsers = userData.length;
                const avgUsers = totalOrgs > 0 ? (totalUsers / totalOrgs).toFixed(1) : 0;

                setStats({ totalOrgs, totalUsers, avgUsers });

                // --- Remove Mock Data ---
                // const dataWithUsers = orgData.map((org, index) => ({
                //     ...org,
                //     userCount: (index * 30) + 50 + Math.floor(Math.random() * 20) 
                // }));
                
                // --- Add Real User Count Fetching ---
                // 1. Create an array of promises, one for each org's user list
                const userCountPromises = orgData.map(org => getOrgUsers(org.id));
                
                // 2. Wait for all those promises to resolve
                const userCountResponses = await Promise.all(userCountPromises);
                
                // 3. Map the results back to the org data
                const dataWithUsers = orgData.map((org, index) => ({
                    ...org,
                    // The user count is the length of the 'data' array from the corresponding API response
                    userCount: userCountResponses[index].data.length 
                }));

                setOrgs(dataWithUsers);

            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Breadcrumbs items={[{ name: 'Dashboard' }]} />
            <h1 className="h3 mb-4">Dashboard</h1>

            {isLoading ? (
                <Loader />
            ) : (
                <>
                    
                    {/* --- Dashboard Chart --- */}
                    <Card className="shadow-sm border">
                        <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
                            <h2 className="h5 mb-0">Organization User Counts</h2>
                            <Button variant="link" as={Link} to="/manage-b2b" className="text-decoration-none">
                                View All Orgs
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart
                                        data={orgs}
                                        margin={{
                                            top: 5, right: 30, left: 20, bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="userCount" fill="#6d28d9" name="User Count" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </>
            )}
        </>
    );
}

