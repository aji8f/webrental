
import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

async function verify() {
    try {
        console.log('Verifying Categories...');
        const categories = await axios.get(`${BASE_URL}/categories`);
        console.log(`- Fetched ${categories.data.length} categories`);

        console.log('Verifying Services...');
        const services = await axios.get(`${BASE_URL}/services`);
        console.log(`- Fetched ${services.data.length} services`);

        console.log('Verifying Leads...');
        const leads = await axios.get(`${BASE_URL}/leads`);
        console.log(`- Fetched ${leads.data.length} leads`);

        console.log('Verifying Projects...');
        const projects = await axios.get(`${BASE_URL}/projects`);
        console.log(`- Fetched ${projects.data.length} projects`);

        console.log('Verifying Settings...');
        const settings = await axios.get(`${BASE_URL}/settings`);
        if (settings.data) console.log(`- Settings fetched successfully`);
        else console.error('- Settings fetch failed or empty');

        console.log('Verifying Stats...');
        const stats = await axios.get(`${BASE_URL}/stats`);
        if (stats.data) console.log(`- Stats fetched successfully`);
        else console.error('- Stats fetch failed or empty');

        console.log('Verifying About...');
        const about = await axios.get(`${BASE_URL}/about`);
        if (about.data) console.log(`- About fetched successfully`);
        else console.error('- About fetch failed or empty');

        console.log('All verifications passed!');

    } catch (error) {
        console.error('Verification failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

verify();
